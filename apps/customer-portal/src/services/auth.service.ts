import { AuthenticationService, CustomerModel, OtpService, PartnerModel, TokenApp, UserModel, UserService } from '@lib';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { utils } from '@lib';

@Injectable()
export class AuthService {

    logger = new Logger('AuthService')

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) { }

    login(login: LoginDto) {
        if (login.email) {
            return this.loginWithEmail(login.email)
        } else if (login.phone) {
            return this.loginWithPhone(login.phone)
        } else {
            return Promise.reject(new BadRequestException(`Missing email or phone.`))
        }
    }

    private async loginWithEmail(email: string) {
        // Find Customer by email, may be matched with multiple customer
        const customers = await CustomerModel.query().where({ email })
        return this.loginCustomer(customers)
    }

    private async loginWithPhone(phone: string) {

        phone = utils.normalizePhoneNumber(phone)
        // Find Customer by phone, may be matched with multiple customer
        const customers = await CustomerModel.query().where({ mobilePhone: phone })
        return this.loginCustomer(customers)
    }

    private async loginCustomer(customers: CustomerModel[]) {
        if (customers.length == 0) {
            return Promise.reject(new BadRequestException(`Customer not found.`))
        }
        const foundUserId = customers.find(v => !!v.userId)?.userId
        let user: UserModel

        if (foundUserId) {
            user = await UserModel.query().findById(foundUserId)
        } else {
            // Register the customer into user    
            user = await this.userService.createUserFromCustomers(customers)
        }

        if (!user) {
            return Promise.reject(new BadRequestException(`No Customer User to login.`))
        }


        if (!this.authenticationService.isThisRoleAllowedToLoginApp(user.role?.slug, TokenApp.PARTNER)) {
            this.logger.log(`Customer userId ${user.id} with role ${user.role?.slug} is not allowed to login in Customer Portal`)
            throw new UnauthorizedException('Invalid email or password')
        }
        // todo: Check last OTP, generate new if required.
        

        const expiresIn = this.authenticationService.expiresIn
        const token = this.authenticationService.generateToken(user.id, TokenApp.PARTNER, expiresIn);
        this.logger.log(`User logged in: userId ${user.id} (${user.email}) CustomerIds ${customers.map(v => v.id)}`)

        return { token, user, customers, expiresIn }
    }

}
