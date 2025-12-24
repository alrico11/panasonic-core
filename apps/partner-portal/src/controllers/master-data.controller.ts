import { Controller, Get, Query } from '@nestjs/common';
import { MasterDataService, PaginationDto } from '@lib';

@Controller('master-data')
export class MasterDataController {
    constructor(private readonly masterDataService: MasterDataService) { }

    @Get('iris')
    listIrisCodes(@Query() paginationDto: PaginationDto, @Query('search') search: string) {
        return this.masterDataService.listIrisCodes(paginationDto, search);
    }

    @Get('job-reasons')
    listJobReasons(@Query() paginationDto: PaginationDto, @Query('search') search: string) {
        return this.masterDataService.listJobReasons(paginationDto, search);
    }

    @Get('statuses')
    listWorkOrderStatuses() {
        return this.masterDataService.listWorkOrderStatuses();
    }
}
