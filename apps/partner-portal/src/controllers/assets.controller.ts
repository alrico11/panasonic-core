import { AssetService, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateAssetDto, UpdateAssetDto } from '../dtos';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetService: AssetService) {}

  /**
   * Get all assets
   * GET /assets
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.assetService.findAll(paginationDto);
  }

  /**
   * Get asset by ID
   * GET /assets/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.findById(id);
  }

  /**
   * Create a new asset
   * POST /assets
   */
  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  /**
   * Update asset
   * PATCH /assets/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    return this.assetService.update(id, updateAssetDto);
  }

  /**
   * Delete asset
   * DELETE /assets/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.delete(id);
  }

  /**
   * Get assets by product id
   * GET /assets/product/:productId
   */
  @Get('product/:productId')
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.assetService.findByProductId(productId);
  }

  /**
   * Get assets by model id
   * GET /assets/model/:modelId
   */
  @Get('model/:modelId')
  findByModelId(@Param('modelId', ParseIntPipe) modelId: number) {
    return this.assetService.findByModelId(modelId);
  }

  /**
   * Get assets by warranty id
   * GET /assets/warranty/:warrantyId
   */
  @Get('warranty/:warrantyId')
  findByWarrantyId(@Param('warrantyId', ParseIntPipe) warrantyId: number) {
    return this.assetService.findByWarrantyId(warrantyId);
  }

  /**
   * Get child assets
   * GET /assets/:parentAssetId/children
   */
  @Get(':parentAssetId/children')
  findChildren(@Param('parentAssetId', ParseIntPipe) parentAssetId: number) {
    return this.assetService.findChildren(parentAssetId);
  }

  /**
   * Get assets by customer id
   * GET /assets/customer/:customerId
   */
  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.assetService.findByCustomerId(customerId);
  }
}
