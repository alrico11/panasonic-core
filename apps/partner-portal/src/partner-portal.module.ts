import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartnerPortalController } from './partner-portal.controller';
import { PartnerPortalService } from './partner-portal.service';
import { LibraryModule } from '@lib';
import { DatabaseModule } from '@lib';
import { SampleModule } from '@lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.partner-portal', '.env.local', '.env']
    }),
    DatabaseModule,
    LibraryModule,
    SampleModule
  ],
  controllers: [PartnerPortalController],
  providers: [PartnerPortalService],
})
export class PartnerPortalModule { }
