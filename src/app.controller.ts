import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): object {
        return this.appService.getWelcome();
    }

    @Get('health')
    getHealth(): object {
        return { status: 'ok', service: 'customer-portal-api', port: 4001 };
    }

    @Get('library-data')
    getLibraryData(): object {
        return this.appService.getLibraryData();
    }

    @Get('library-info')
    getLibraryInfo(): object {
        return this.appService.getLibraryInfo();
    }
}
