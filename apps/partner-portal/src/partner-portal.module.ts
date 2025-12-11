import { Module } from '@nestjs/common';
import { PartnerPortalController } from './partner-portal.controller';
import { PartnerPortalService } from './partner-portal.service';

@Module({
  imports: [],
  controllers: [PartnerPortalController],
  providers: [PartnerPortalService],
})
export class PartnerPortalModule {}
