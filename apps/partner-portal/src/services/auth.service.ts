import { AuthenticationService, PartnerModel, randomStrings, TokenApp, UserModel } from '@lib';
import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hashSync } from 'bcrypt';
import * as ms from 'ms';

@Injectable()
export class AuthService {

    private maxLoginAttempts: number
    private maxLoginExpiresIn: number
    logger = new Logger('AuthService')

    constructor(
        private readonly authenticationService: AuthenticationService,
        configService: ConfigService) {
        this.maxLoginAttempts = parseInt(configService.get('PARTNER_MAX_LOGIN_ATTEMPTS', '5'))
        this.maxLoginExpiresIn = ms(configService.get('PARTNER_MAX_LOGIN_EXPIRES_IN', '1h') as ms.StringValue)

        if (isNaN(this.maxLoginAttempts))
            this.maxLoginAttempts = 5

        if (isNaN(this.maxLoginExpiresIn))
            this.maxLoginExpiresIn = 60 * 60 * 1000

    }

    async login(email: string, password: string, remember?: boolean) {
        return UserModel.transaction(async trx => {
            // Find user by email
            let user = await UserModel.query().where({ email }).forUpdate().first()

            if (!user) {
                this.logger.warn(`User with email "${email}" not found`)
                return Promise.reject(new UnauthorizedException('Invalid email or password'))
            }

            if (user.lockUntil) {
                if (user.lockUntil.getTime() < Date.now()) {
                    // reset
                    this.logger.log(`User lock reset for ${user.email} [${user.id}]`)
                    await UserModel.query(trx).findById(user.id).update({
                        lockUntil: null,
                        loginAttempts: 0
                    })
                } else {
                    return Promise.reject(new ForbiddenException(`Your account is locked until: ${user.lockUntil.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`))
                }
            }

            await UserModel.query(trx).findById(user.id).update({
                loginAttempts: UserModel.raw('COALESCE("loginAttempts",0) + 1'),
                lastLogin: UserModel.fn.now()
            })

            user = await UserModel.query(trx).findById(user.id).withGraphFetched('role')
                .first()
            return user
        }).then(async user => {
            const partnerUser = await PartnerModel.query().where({ userId: user.id }).first()
            if (!partnerUser) {
                this.logger.log(`Partner with email "${email}" and userId ${user.id} not found`)
                throw new UnauthorizedException('Invalid email or password')
            }

            const passwordMatches = await compare(password, partnerUser.password);
            if (passwordMatches) {
                // reset
                await UserModel.query().findById(user.id).update({
                    loginAttempts: 0,
                    lockUntil: null,
                    lastLogin: UserModel.fn.now()
                })
            } else {
                if (user.loginAttempts >= this.maxLoginAttempts) {
                    const lockUntil = new Date(Date.now() + this.maxLoginExpiresIn)
                    this.logger.log(`User locked ${user.email} [${user.id}]`)
                    await UserModel.query().findById(user.id).update({ lockUntil })
                }
                throw new UnauthorizedException('Invalid email or password')
            }

            if (!this.authenticationService.isThisRoleAllowedToLoginApp(user.role?.slug, TokenApp.PARTNER)) {
                this.logger.log(`Partner with email "${email}" and userId ${user.id} with role ${user.role?.slug} is not allowed to login in Partner Portal`)
                throw new UnauthorizedException('Invalid email or password')
            }

            const expiresIn = remember ? this.authenticationService.rembemberMeExpiresIn : this.authenticationService.expiresIn
            const token = this.authenticationService.generateToken(user.id, TokenApp.PARTNER, expiresIn);
            this.logger.log(`User logged in: userId ${user.id} (${user.email}) partnerId ${partnerUser.id}`)
            return { token, user, partnerUser, expiresIn }
        })
    }

    async forgotPassword(email: string) {
        // Find user by email
        const user = await UserModel.query().where({ email })
            .withGraphFetched('role')
            .first()

        if (!user) {
            this.logger.warn(`User with email "${email}" not found`)
            return
        }

        const partnerUser = await PartnerModel.query().where({ userId: user.id }).first()
        if (!partnerUser) {
            this.logger.log(`Partner with email "${email}" and userId ${user.id} not found`)
            throw new UnauthorizedException('Invalid email or password')
        }
        // Create random Code
        const code = randomStrings(user.id.toString(36) + '-')

        await PartnerModel.query().findById(partnerUser.id).update({
            forgotPassword: code
        })

        // todo: Send email
        this.logger.debug(`Send reset code ${code} to ${user.email}`) // REMOVE IN PRODUCTION

        return { user, partnerUser }
    }

    async checkForgotPasswordCode(code: string) {

        const partnerUser = await PartnerModel.query().where({ forgotPassword: code }).first()
        if (!partnerUser) {
            return Promise.reject(new NotFoundException(`Code invalid or not found`))
        }
        return { partnerId: partnerUser.id, userId: partnerUser.userId }
    }

    async resetPassword(code: string, newPassword: string) {

        const partnerUser = await PartnerModel.query().where({ forgotPassword: code }).first()
        if (!partnerUser) {
            return Promise.reject(new NotFoundException(`Code invalid or not found`))
        }
        await PartnerModel.query().findById(partnerUser.id).update({
            ['pas' + 'sword']: hashSync(newPassword, 10),
            forgotPassword: null,
            lastNotifUpdatePassword: null,
            loginAttempts: 0,
            lockUntil: null,
            lastUpdatePassword: PartnerModel.fn.now()
        })

        return { success: true }
    }

}
