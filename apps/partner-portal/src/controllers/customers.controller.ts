import { Action, CustomerService, CreateCustomerDto, UpdateCustomerDto, NoLogin, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { Request } from 'express'

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomerService) {}

    /**
     * Get all customers
     * GET /customers
     */
    @Get()
    // @Action('list', 'customer')
    // @NoLogin()
    listAllCustomers(@Req() req: Request, @Query() paginationDto: PaginationDto) {
        console.log('req.token: ', req.token)
        return this.customerService.listAllCustomers(paginationDto, req.token);
        // return this.customerService.listAllCustomers(paginationDto);
    }


    /**
     * Get customer by ID
     * GET /customers/:id
     */
    @Get(':id')
    // @NoLogin()
    // @Action('detail', 'customer')
    findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
       return this.customerService.findCustomerById(id, req.token);
       // return this.customerService.findCustomerById(id);
    }

    /**
     * Create a new customer
     * POST /customers
     */
    @Post()
    // @NoLogin()
    // @Action('create', 'customer')
    create(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto) {
        console.log('req.token: ', req.token)
        // return 'ok'
        return this.customerService.createCustomer(createCustomerDto, req.token);
    }

    /**
     * Update customer
     * PATCH /customers/:id
     */
    @Patch(':id')
    // @NoLogin()
    // @Action('edit', 'customer')
    update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        return this.customerService.updateCustomer(id, updateCustomerDto, req.token);
    }

    /**
     * Delete customer
     * DELETE /customers/:id
     */
    @Delete(':id')
    // @NoLogin()
    // @Action('delete', 'customer')
    remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        return this.customerService.deleteCustomer(id, req.token);
    }
}
