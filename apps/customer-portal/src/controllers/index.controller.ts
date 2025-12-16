import { Controller, Get, Query } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly rbacService: RbacService,
    ) { }

    @Get()
    getHello() {
        return {
            service: 'customer-portal',
            library: this.libraryService.getLibraryInfo()
        }
    }

    @Get('health')
    @NoLogin()
    getHealth(): object {
        return {
            status: 'ok'
        }
    }

    @Get('library-data')
    @NoLogin()
    getLibraryData(): object {
        return {
            data: this.libraryService.getSampleData(),
            info: this.libraryService.getLibraryInfo()
        }
    }
}
