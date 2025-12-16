import { AuthenticationService, PartnerModel, TokenApp, UserModel } from '@lib';
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

    logger = new Logger('AuthService')

    constructor(private readonly authenticationService: AuthenticationService) { }

    async login(email: string, password: string) {
        // Find user by email
        const user = await UserModel.query().where({ email }).first()

        if (!user) {
            this.logger.warn(`User with email "${email}" not found`)
            throw new UnauthorizedException('Invalid email or password')
        }

        const partnerUser = await PartnerModel.query().where({ userId: user.id }).first()
        if (!partnerUser) {
            this.logger.log(`Partner with email "${email}" and userId ${user.id} not found`)
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordMatches = await compare(password, partnerUser.password);
        if (!passwordMatches) {
            this.logger.log('Invalid password')
            throw new UnauthorizedException('Invalid email or password')
        }

        const token = this.authenticationService.generateToken(user.id, TokenApp.PARTNER);
        this.logger.log(`User logged in: userId ${user.id} (${user.email}) partnerId ${partnerUser.id}`)
        return { token, user, partnerUser, expiresIn: this.authenticationService.expiresIn }
    }
}
