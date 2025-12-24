import { AuthenticationService, CustomerModel, CustomerService, normalizePhoneNumber, OtpService, PartnerModel, TokenApp, UserModel, UserService } from '@lib';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';

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
    private allowResendAfter: number

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly customerService: CustomerService,
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        configService: ConfigService,
    ) {
        this.maxLoginAttempts = parseInt(configService.get('CUSTOMER_MAX_LOGIN_ATTEMPTS', '5'))
        this.maxLoginExpiresIn = ms(configService.get('CUSTOMER_MAX_LOGIN_EXPIRES_IN', '1h') as ms.StringValue)
        this.allowResendAfter = ms(configService.get('CUSTOMER_ALLOW_RESEND_AFTER', '2m') as ms.StringValue)

        if (isNaN(this.maxLoginAttempts))
            this.maxLoginAttempts = 5

        if (isNaN(this.maxLoginExpiresIn))
            this.maxLoginExpiresIn = 60 * 60 * 1000

        if (isNaN(this.allowResendAfter))
            this.allowResendAfter = 2 * 60 * 1000
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

        phone = normalizePhoneNumber(phone)
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
                    loginAttempts: UserModel.raw('COALESCE("loginAttempts",0) + 1'),
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
            if (user.isOtpUsed || !user.otpExpiredAt || user.otpExpiredAt < new Date()) {
                generateNewOtp = true
            }
        } else {
            generateNewOtp = true
        }

        if (generateNewOtp) {
            await this.generateAndSendOtp(user.id, authKind)
        } else {
            this.logger.log(`Not sending ${authKind.channel} to ${authKind.value}, using OLD otp code.`)
        }

        return { userId: user.id }
    }

    private async generateAndSendOtp(userId: number, authKind: AuthKind) {
        const otp = this.otpService.generateOtp()
        const changes = {
            otpCode: otp.otpCode,
            otpCodeAttempt: 0,
            otpExpiredAt: otp.otpExpiredAt as any
        }
        await UserModel.query().findById(userId).update(changes)
        await this.sendOtp(changes.otpCode, authKind, userId)
        return otp
    }

    private async sendOtp(code: string, authKind: AuthKind, userId?: number) {
        switch (authKind.channel) {
            case 'email':
                // todo: email sender
                this.logger.log(`Send OTP via email to ${authKind.value} [${code}] (userId: ${userId})`)
                break
            case 'phone':
                // todo: Phone sender
                this.logger.log(`Send OTP via phone to ${authKind.value} [${code}] (userId: ${userId})`)
                break
            default:
                this.logger.warn(`No sender for channel ${authKind.channel} to ${authKind.value} (userId: ${userId})`)
                break
        }
    }

    async verifyOtp(userId: number, otpCode: string) {
        return UserModel.transaction(async trx => {
            const user = await UserModel.query(trx).findById(userId).forUpdate()

            if (!user) {
                return Promise.reject(new BadRequestException(`Customer User not found.`))
            }
            let otpCodeAttempt = user.otpCodeAttempt + 1
            if (otpCodeAttempt >= this.otpService.maxAttempts) {
                return Promise.reject(new ForbiddenException('Too many OTP fails.'))
            }

            await UserModel.query(trx).findById(user.id).update({
                otpCodeAttempt: UserModel.raw('COALESCE("otpCodeAttempt",0) + 1')
            })

            if (!user.otpCode
                || user.isOtpUsed
                || user.otpExpiredAt >= new Date()
                || user.otpCode !== otpCode
            ) {
                if (user.otpCode) {
                }
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
        return UserModel.transaction(async trx => {
            const user = await UserModel.query(trx).findById(userId).forUpdate()

            if (!user) {
                return Promise.reject(new BadRequestException(`Customer User not found.`))
            }
            // Because no dedicated field for OTP resend counter, treat is as OTP attemps
            let otpCodeAttempt = user.otpCodeAttempt + 1
            if (otpCodeAttempt >= this.otpService.maxAttempts) {
                return Promise.reject(new ForbiddenException('Too many resend.'))
            }
            await UserModel.query(trx).findById(user.id).update({
                otpCodeAttempt: UserModel.raw('COALESCE("otpCodeAttempt",0) + 1')
            })

            const otpAllowResendAt = new Date(user.otpExpiredAt.getTime() - this.otpService.expiresInMs + this.allowResendAfter)

            if (new Date() < otpAllowResendAt) {
                return Promise.reject(new BadRequestException(`You can resend OTP at ${otpAllowResendAt.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                })}`))
            }
            let generateNewOtp = false
            if (user.otpCode) {
                if (user.otpExpiredAt < new Date()) {
                    generateNewOtp = true
                }
            } else {
                generateNewOtp = true
            }

            const authKind: AuthKind = {
                channel: via,
                value: via == 'email' ? user.email : user.mobilePhone
            }

            if (generateNewOtp) {
                await this.generateAndSendOtp(user.id, authKind)
                return { resend: true, otpCodeChanged: true }
            } else {
                // just resend old code
                this.logger.debug(`Resend old OTP code for userId: ${userId}`)
                await this.sendOtp(user.otpCode, authKind)
                return { resend: true, otpCodeChanged: false }
            }
        })
    }
}
