import { WarrantyService, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateWarrantyDto, UpdateWarrantyDto } from '../dtos';

@Controller('warranties')
export class WarrantiesController {
  constructor(private readonly warrantyService: WarrantyService) {}

  /**
   * Get all warranties
   * GET /warranties
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.warrantyService.findAll(paginationDto);
  }

  /**
   * Get warranty by ID
   * GET /warranties/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.findById(id);
  }

  /**
   * Create a new warranty
   * POST /warranties
   */
  @Post()
  create(@Body() createWarrantyDto: CreateWarrantyDto) {
    return this.warrantyService.create(createWarrantyDto);
  }

  /**
   * Update warranty
   * PATCH /warranties/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ) {
    return this.warrantyService.update(id, updateWarrantyDto);
  }

  /**
   * Delete warranty
   * DELETE /warranties/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.delete(id);
  }

  /**
   * Get warranties by dealer id
   * GET /warranties/dealer/:dealerId
   */
  @Get('dealer/:dealerId')
  findByDealerId(@Param('dealerId', ParseIntPipe) dealerId: number) {
    return this.warrantyService.findByDealerId(dealerId);
  }

  /**
   * Get warranties by customer id
   * GET /warranties/customer/:customerId
   */
  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.warrantyService.findByCustomerId(customerId);
  }
}
