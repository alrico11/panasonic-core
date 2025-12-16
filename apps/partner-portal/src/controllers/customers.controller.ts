import { Action, CustomerService, CreateCustomerDto, UpdateCustomerDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomerService) {}

    /**
     * Get all customers
     * GET /customers
     */
    @Get()
    @Action('list', 'customer')
    async listAllCustomers() {
        const customers = await this.customerService.listAllCustomers();
        return {
            success: true,
            message: 'Customers fetched successfully',
            data: customers,
        };
    }


    /**
     * Get customer by ID
     * GET /customers/:id
     */
    @Get(':id')
    @Action('detail', 'customer')
    async findOne(@Param('id') id: string) {
        const customer = await this.customerService.findCustomerById(Number(id));
        return {
            success: true,
            message: 'Customer fetched successfully',
            data: customer,
        };
    }

    /**
     * Create a new customer
     * POST /customers
     */
    @Post()
    @Action('create', 'customer')
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        const customer = await this.customerService.createCustomer(createCustomerDto);
        return {
            success: true,
            message: 'Customer created successfully',
            data: customer,
        };
    }

    /**
     * Update customer
     * PATCH /customers/:id
     */
    @Patch(':id')
    @Action('edit', 'customer')
    async update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        const customer = await this.customerService.updateCustomer(Number(id), updateCustomerDto);
        return {
            success: true,
            message: 'Customer updated successfully',
            data: customer,
        };
    }

    /**
     * Delete customer
     * DELETE /customers/:id
     */
    @Delete(':id')
    @Action('delete', 'customer')
    async remove(@Param('id') id: string) {
        const result = await this.customerService.deleteCustomer(Number(id));
        return {
            success: true,
            message: result.message,
            data: result,
        };
    }
}
