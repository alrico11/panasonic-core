import { Action, CustomerService, CreateCustomerDto, UpdateCustomerDto, NoLogin, PaginationDto, getPresignedUrlExpiresIn } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'
import type { Multer } from 'multer';
import { multerImageOptions } from '@lib';

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
     * Get presigned URL for customer's profile picture
     * GET /customers/:id/profile-picture-url
     */
    @Get(':id/profile-picture-url')
    // @NoLogin()
    // @Action('detail', 'customer')
    async getProfilePictureUrl(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
       const presignedUrl = await this.customerService.getProfilePicturePresignedUrl(id);
       const expiresIn = getPresignedUrlExpiresIn(); // Get actual expiration time from env or default
       console.log(`Presigned URL expires in: ${expiresIn} seconds`);
       return {
         id,
         presignedUrl,
         expiresIn // Now returns actual value from env variable or default
       };
    }

    /**
     * Create a new customer
     * POST /customers
     */
    @Post()
    @UseInterceptors(FileInterceptor('profilePicture', multerImageOptions))
    // @NoLogin()
    // @Action('create', 'customer')
    create(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto, @UploadedFile() file?: Multer.File) {
        console.log('req.token: ', req.token)
        if (file) {
          createCustomerDto.profilePicture = file as any;
        }
        return this.customerService.createCustomer(createCustomerDto, req.token);
    }

    /**
     * Update customer
     * PATCH /customers/:id
     */
    @Patch(':id')
    @UseInterceptors(FileInterceptor('profilePicture', multerImageOptions))
    // @NoLogin()
    // @Action('edit', 'customer')
    update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
        @UploadedFile() file?: Multer.File
    ) {
        if (file) {
          updateCustomerDto.profilePicture = file as any;
        }
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
