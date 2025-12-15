import { Controller, Get } from '@nestjs/common';
import { CustomerPortalService } from './customer-portal.service';
import { Action, SampleService } from '@lib';

@Controller()
export class CustomerPortalController {
  constructor(
    private readonly customerPortalService: CustomerPortalService,
    private readonly sampleService: SampleService
  ) {}

    @Get()
    getHello(): object {
        return this.customerPortalService.getWelcome();
    }

    @Get('sample')
    getSample(): object {
        return this.sampleService.getMigrationHistory()
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
