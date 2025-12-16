import { Action, CustomerService } from '@lib';
import { Controller, Get } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomerService) {

    }
    @Get()
    @Action('search', 'customer')
    lists() {
        return this.customerService.listAllCustomers();
    }
    /*
        create customer	POST	/customers
        update customer	PATCH	/customers/:id
        delete customer	DELETE	/customers/:id
        detail	GET	/customers/:id
        list	GET	/customers
     */
}
