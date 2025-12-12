import { Controller, Get } from '@nestjs/common';
import { PartnerPortalService } from './partner-portal.service';

@Controller()
export class PartnerPortalController {
  constructor(private readonly partnerPortalService: PartnerPortalService) {}

  @Get()
  getHello(): string {
    return this.partnerPortalService.getHello();
  }
}
