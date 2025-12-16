import { Action, CustomerService } from '@lib';
import { Controller, Get } from '@nestjs/common';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {

    }
    @Get('view/id')
    @Action('view')
    getSample(): object {
        return { ok: true }
    }
    /* 
     My Account	GET	/customer
    Login Account	POST	/customer/login
    Create Account	POST	/customer
    My Warranty History	GET	/customer/warranty
    My Ticket History	GET	/customer/ticket
    My Repair Order	GET	/customer/repair
    My Auth Setting	PATCH	/customer
    Logout	POST	/customer/logout
    */
}
