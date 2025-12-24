import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ChargeService, PaginationDto, CreateChargeDto, UpdateChargeDto } from '@lib';

@Controller('charges')
export class ChargesController {
    constructor(private readonly chargeService: ChargeService) { }

    @Get()
    listCharges(
        @Query() paginationDto: PaginationDto,
        @Query('search') search?: string,
        @Query('workOrderId') workOrderId?: string
    ) {
        const woId = workOrderId ? parseInt(workOrderId) : undefined;
        return this.chargeService.listCharges(paginationDto, search, woId);
    }

    @Get(':id')
    getChargeById(@Param('id', ParseIntPipe) id: number) {
        return this.chargeService.getChargeById(id);
    }

    @Post()
    createCharge(@Body() createChargeDto: CreateChargeDto) {
        return this.chargeService.createCharge(createChargeDto);
    }

    @Patch(':id')
    updateCharge(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateChargeDto: UpdateChargeDto
    ) {
        return this.chargeService.updateCharge(id, updateChargeDto);
    }

    @Delete(':id')
    deleteCharge(@Param('id', ParseIntPipe) id: number) {
        return this.chargeService.deleteCharge(id);
    }
}
