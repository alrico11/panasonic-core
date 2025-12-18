import { AuthenticationService, CustomerModel, CustomerService, OtpService, PartnerModel, TokenApp, UserModel, UserService } from '@lib';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { utils } from '@lib';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';

interface AuthKind {
    channel: 'email' | 'phone',
    value: string
}

@Injectable()
export class AuthService {

    logger = new Logger('AuthService')
    private maxLoginAttempts: number
    private maxLoginExpiresIn: number

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly customerService: CustomerService,
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        configService: ConfigService,
    ) {
        this.maxLoginAttempts = parseInt(configService.get('CUSTOMER_MAX_LOGIN_ATTEMPTS', '5'))
        this.maxLoginExpiresIn = ms(configService.get('CUSTOMER_MAX_LOGIN_EXPIRES_IN', '1h'))

        if (isNaN(this.maxLoginAttempts))
            this.maxLoginAttempts = 5

        if (isNaN(this.maxLoginExpiresIn))
            this.maxLoginExpiresIn = 60 * 60 * 1000
    }

    login(login: LoginDto) {
        if (login.email && login.phone) {
            return Promise.reject(new BadRequestException(`Please choose one: email or phone.`))
        }
        if (login.email) {
            return this.loginWithEmail(login.email)
        } else if (login.phone) {
            return this.loginWithPhone(login.phone)
        } else {
            return Promise.reject(new BadRequestException(`Missing email or phone.`))
        }
    }

    private async loginWithEmail(email: string) {
        // Find Customer by email, may be matched with multiple customers
        const customers = await this.customerService.findAllRelatedCustomerByEmail(email)

        return this.loginCustomer(customers, { channel: 'email', value: email })
    }

    private async loginWithPhone(phone: string) {

        phone = utils.normalizePhoneNumber(phone)
        // Find Customer by phone, may be matched with multiple customers
        const customers = await this.customerService.findAllRelatedCustomerByPhone(phone)

        return this.loginCustomer(customers, { channel: 'phone', value: phone })
    }

    private async loginCustomer(customers: CustomerModel[], authKind: AuthKind) {
        if (customers.length == 0) {
            return Promise.reject(new BadRequestException(`Customer not found.`))
        }
        let userId = customers.find(v => !!v.userId)?.userId

        if (!userId) {
            // Register the customer into user    
            userId = (await this.userService.createUserFromCustomers(customers)).id
        }

        const user = await UserModel.transaction(async (trx) => {

            const user = await UserModel.query(trx).findById(userId).forUpdate()

            if (!user) {
                return Promise.reject(new InternalServerErrorException(`No Customer User to login.`))
            }

            if (user.loginAttempts === null || user.loginAttempts === undefined || !user.lastLogin) {
                // first time login
                await UserModel.query(trx).findById(user.id).update({
                    loginAttempts: 1,
                    lastLogin: UserModel.fn.now()
                })
            } else if (user.loginAttempts > this.maxLoginAttempts) {
                const lastLoginTime = user.lastLogin.getTime() || 0
                const timeSinceLastLogin = Date.now() - lastLoginTime

                if (timeSinceLastLogin < this.maxLoginExpiresIn) {
                    return Promise.reject(new UnauthorizedException('Too many login attempts. Please try again later.'))
                }
                // reset
                await UserModel.query(trx).findById(user.id).update({
                    loginAttempts: 1,
                    lastLogin: UserModel.fn.now()
                })
            } else {
                await UserModel.query(trx).findById(user.id).update({
                    loginAttempts: UserModel.raw('"loginAttempts" + 1'),
                    lastLogin: UserModel.fn.now()
                })
            }

            return UserModel.query(trx).findById(user.id).withGraphFetched('role')
        })


        if (!this.authenticationService.isThisRoleAllowedToLoginApp(user.role?.slug, TokenApp.CUSTOMER)) {
            this.logger.log(`Customer userId ${user.id} with role ${user.role?.slug} is not allowed to login in Customer Portal`)
            return Promise.reject(new UnauthorizedException('Your role is not allowed to login in this App'))
        }

        let generateNewOtp = false
        if (user.otpCode) {
            if (user.isOtpUsed || !user.otpExpiredAt || user.otpExpiredAt < new Date()  ) {
                generateNewOtp = true
            }
        } else {
            generateNewOtp = true
        }

        if (generateNewOtp) {
            const otp = this.otpService.generateOtp()
            const changes = {
                otpCode: otp.otpCode,
                otpCodeAttempt: 0,
                otpExpiredAt: otp.otpExpiredAt as any
            }
            await UserModel.query().findById(user.id).update(changes)
            switch (authKind.channel) {
                case 'email':
                    // todo: email sender
                    this.logger.log(`Send OTP via email to ${authKind.value} [${changes.otpCode}] (userId: ${user.id})`)
                    break
                case 'phone':
                    // todo: Phone sender
                    this.logger.log(`Send OTP via phone to ${authKind.value} [${changes.otpCode}] (userId: ${user.id})`)
                    break
                default:
                    this.logger.warn(`No sender for channel ${authKind.channel} to ${authKind.value} (userId: ${user.id})`)
                    break
            }
        } else {
            this.logger.log(`Not sending ${authKind.channel} to ${authKind.value}, using OLD otp code.`)
        }

        return { userId: user.id }
    }

    async verifyOtp(userId: number, otpCode: string) {
        return UserModel.transaction(async trx => {
            const user = await UserModel.query(trx).findById(userId).forUpdate()

            if (!user) {
                return Promise.reject(new BadRequestException(`Customer User not found.`))
            }

            if (!user.otpCode
                || user.isOtpUsed
                || user.otpExpiredAt >= new Date()
                || user.otpCode !== otpCode
            ) {
                return Promise.reject(new BadRequestException(`OTP Code expired, invalid or not found.`))
            }

            await UserModel.query(trx).findById(user.id).update({ isOtpUsed: true })

            const expiresIn = this.authenticationService.expiresIn
            const token = this.authenticationService.generateToken(user.id, TokenApp.CUSTOMER, expiresIn);
            this.logger.log(`Customer User logged in: userId ${user.id} (${user.email})`)
            return { token, user, expiresIn }
        })
    }

    async resendOtp(userId: number, via: AuthKind['channel']) {

    }

}
