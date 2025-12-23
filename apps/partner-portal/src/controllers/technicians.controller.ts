import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { TechnicianService, PaginationDto } from '@lib';

@Controller('technicians')
export class TechniciansController {
    constructor(private readonly technicianService: TechnicianService) { }

    @Get()
    listTechnicians(@Query() paginationDto: PaginationDto, @Query('search') search: string) {
        return this.technicianService.listTechnicians(paginationDto, search);
    }

    @Get(':id')
    getTechnicianById(@Param('id', ParseIntPipe) id: number) {
        return this.technicianService.getTechnicianById(id);
    }
}
