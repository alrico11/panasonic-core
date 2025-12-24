import { ModelService, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateModelDto, UpdateModelDto } from '../dtos';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelService: ModelService) {}

  /**
   * Get all models
   * GET /models
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.modelService.findAll(paginationDto);
  }

  /**
   * Get model by ID
   * GET /models/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modelService.findById(id);
  }

  /**
   * Create a new model
   * POST /models
   */
  @Post()
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelService.create(createModelDto as any);
  }

  /**
   * Update model
   * PATCH /models/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModelDto: UpdateModelDto,
  ) {
    return this.modelService.update(id, updateModelDto as any);
  }

  /**
   * Delete model
   * DELETE /models/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modelService.delete(id);
  }
}
