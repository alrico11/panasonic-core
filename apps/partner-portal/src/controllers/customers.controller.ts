import { Action, CustomerService, CreateCustomerDto, UpdateCustomerDto, NoLogin } from '@lib';
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
    @NoLogin()
    listAllCustomers(req: Request) {
        return this.customerService.listAllCustomers();
    }


    /**
     * Get customer by ID
     * GET /customers/:id
     */
    @Get(':id')
    @NoLogin()
    // @Action('detail', 'customer')
    findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
       return this.customerService.findCustomerById(id)
    }

    /**
     * Create a new customer
     * POST /customers
     */
    @Post()
    @NoLogin()
    // @Action('create', 'customer')
    create(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.createCustomer(createCustomerDto);
    }

    /**
     * Update customer
     * PATCH /customers/:id
     */
    @Patch(':id')
    @NoLogin()
    // @Action('edit', 'customer')
    update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        return this.customerService.updateCustomer(id, updateCustomerDto);
    }

    /**
     * Delete customer
     * DELETE /customers/:id
     */
    @Delete(':id')
    @NoLogin()
    // @Action('delete', 'customer')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.customerService.deleteCustomer(id);
    }
}
