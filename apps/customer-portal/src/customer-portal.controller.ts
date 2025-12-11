import { Controller, Get } from '@nestjs/common';
import { CustomerPortalService } from './customer-portal.service';

@Controller()
export class CustomerPortalController {
  constructor(private readonly customerPortalService: CustomerPortalService) {}

    @Get()
    getHello(): object {
        return this.customerPortalService.getWelcome();
    }

    @Get('health')
    getHealth(): object {
        return { status: 'ok', service: 'customer-portal-api', port: 4001 };
    }

    @Get('library-data')
    getLibraryData(): object {
        return this.customerPortalService.getLibraryData();
    }

    @Get('library-info')
    getLibraryInfo(): object {
        return this.customerPortalService.getLibraryInfo();
    }
}
