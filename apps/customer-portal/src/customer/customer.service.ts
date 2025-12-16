import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer as ICustomer} from '@lib';

@Injectable()
export class CustomerService {
  // Mock data storage - replace with actual database later
  private customers: ICustomer[] = [];
  private idCounter = 1;

  /**
   * Create a new customer
   */
  create(createCustomerDto: CreateCustomerDto): ICustomer {
    if (!createCustomerDto.name || !createCustomerDto.email) {
      throw new BadRequestException('Name and email are required');
    }

    const customer: ICustomer = {
      id: this.idCounter++,
      ...createCustomerDto,
      
    };

    this.customers.push(customer);
    return customer;
  }

  /**
   * Get all customers
   */
  findAll(): ICustomer[] {
    return this.customers;
  }

  /**
   * Get a customer by ID
   */
  findOne(id: number): ICustomer {
    const customer = this.customers.find(c => c.id === id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  /**
   * Update a customer
   */
  update(id: number, updateCustomerDto: UpdateCustomerDto): ICustomer {
    const customer = this.findOne(id);
    const updatedCustomer = {
      ...customer,
      ...updateCustomerDto
    };

    const index = this.customers.findIndex(c => c.id === id);
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  /**
   * Delete a customer
   */
  remove(id: number): { message: string; id: number } {
    const customer = this.findOne(id);
    this.customers = this.customers.filter(c => c.id !== id);
    return { message: `Customer with ID ${id} deleted successfully`, id };
  }
}
