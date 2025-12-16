import { AuthenticationService } from '@lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    constructor(private readonly authenticationService: AuthenticationService) { }

    login(email: string, password: string) {

    }
}
