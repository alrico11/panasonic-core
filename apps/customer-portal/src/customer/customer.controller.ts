import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer as ICustomer } from '@lib';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Create a new customer
   * POST /customer
   */
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): ICustomer {
    return this.customerService.create(createCustomerDto);
  }

  /**
   * Get all customers
   * GET /customer
   */
  @Get()
  findAll(): ICustomer[] {
    return this.customerService.findAll();
  }

  /**
   * Get a customer by ID
   * GET /customer/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string): ICustomer {
    return this.customerService.findOne(+id);
  }

  /**
   * Update a customer
   * PATCH /customer/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): ICustomer {
    return this.customerService.update(+id, updateCustomerDto);
  }

  /**
   * Delete a customer
   * DELETE /customer/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string): { message: string; id: number } {
    return this.customerService.remove(+id);
  }
}
