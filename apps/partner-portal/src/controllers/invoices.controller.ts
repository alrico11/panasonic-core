import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { InvoiceService, PaginationDto, CreateInvoiceDto, UpdateInvoiceDto } from '@lib';

@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Get()
    listInvoices(
        @Query() paginationDto: PaginationDto,
        @Query('search') search?: string,
        @Query('workOrderId') workOrderId?: string
    ) {
        const woId = workOrderId ? parseInt(workOrderId) : undefined;
        return this.invoiceService.listInvoices(paginationDto, search, woId);
    }

    @Get(':id')
    getInvoiceById(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.getInvoiceById(id);
    }

    @Post()
    createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.createInvoice(createInvoiceDto);
    }

    @Patch(':id')
    updateInvoice(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateInvoiceDto: UpdateInvoiceDto
    ) {
        return this.invoiceService.updateInvoice(id, updateInvoiceDto);
    }

    @Delete(':id')
    deleteInvoice(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.deleteInvoice(id);
    }
}
