import { Module } from '@nestjs/common';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';
import { LibraryModule } from '@lib';
import { DatabaseModule } from '@lib';
import { SampleModule } from '@lib';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.customer-portal', '.env']
    }),
    DatabaseModule,
    LibraryModule,
    SampleModule
  ],
  controllers: [CustomerPortalController],
  providers: [
    CustomerPortalService
  ],
})
export class CustomerPortalModule { }
