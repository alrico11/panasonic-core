import { Controller, Get } from '@nestjs/common';
import { PartnerPortalService } from './partner-portal.service';
import { SampleService } from '@lib';

@Controller()
export class PartnerPortalController {
  constructor(
    private readonly partnerPortalService: PartnerPortalService,
    private readonly sampleService: SampleService
  ) { }

  @Get()
  getHello(): object {
    return this.partnerPortalService.getHello();
  }

  @Get('sample')
  getSample(): object {
    return this.sampleService.getMigrationHistory()
  }

  @Get('health')
  getHealth(): object {
    return { status: 'ok', service: 'partner-portal-api', port: 4002 };
  }

  @Get('library-data')
  getLibraryData(): object {
    return this.partnerPortalService.getLibraryData();
  }

  @Get('library-info')
  getLibraryInfo(): object {
    return this.partnerPortalService.getLibraryInfo();
  }
}
