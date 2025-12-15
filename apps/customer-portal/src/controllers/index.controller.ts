import { Controller, Get } from '@nestjs/common';
import { LibraryService, NoLogin } from '@lib';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService
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
}
