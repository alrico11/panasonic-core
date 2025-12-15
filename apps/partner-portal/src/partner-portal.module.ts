import { Module } from '@nestjs/common';
import { PartnerPortalController } from './partner-portal.controller';
import { PartnerPortalService } from './partner-portal.service';
import { LibraryModule } from '@lib';
import { DatabaseModule } from '@lib';
import { SampleModule } from '@lib';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.partner-portal', '.env']
    }),
    DatabaseModule,
    LibraryModule,
    SampleModule
  ],
  controllers: [PartnerPortalController],
  providers: [PartnerPortalService],
})
export class PartnerPortalModule { }
