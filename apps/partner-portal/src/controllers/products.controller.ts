import { ProductService, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products
   * GET /products
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  /**
   * Get product by ID
   * GET /products/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  /**
   * Create a new product
   * POST /products
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * Update product
   * PATCH /products/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Delete product
   * DELETE /products/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }

  /**
   * Get products by model id
   * GET /products/model/:modelId
   */
  @Get('model/:modelId')
  findByModelId(@Param('modelId', ParseIntPipe) modelId: number) {
    return this.productService.findByModelId(modelId);
  }
}
