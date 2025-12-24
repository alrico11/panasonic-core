import { DealerService, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateDealerDto, UpdateDealerDto } from '../dtos';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealerService: DealerService) {}

  /**
   * Get all dealers
   * GET /dealers
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.dealerService.findAll(paginationDto);
  }

  /**
   * Get dealer by ID
   * GET /dealers/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dealerService.findById(id);
  }

  /**
   * Create a new dealer
   * POST /dealers
   */
  @Post()
  create(@Body() createDealerDto: CreateDealerDto) {
    return this.dealerService.create(createDealerDto);
  }

  /**
   * Update dealer
   * PATCH /dealers/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDealerDto: UpdateDealerDto,
  ) {
    return this.dealerService.update(id, updateDealerDto);
  }

  /**
   * Delete dealer
   * DELETE /dealers/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dealerService.delete(id);
  }
}
