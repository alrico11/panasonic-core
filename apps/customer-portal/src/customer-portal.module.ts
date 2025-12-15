import { Module } from '@nestjs/common';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';
import { AuthenticationModule, LibraryModule } from '@lib';
import { DatabaseModule } from '@lib';
import { SampleModule } from '@lib';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    AuthenticationModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule
  ],
  controllers: [CustomerPortalController],
  providers: [
    CustomerPortalService
  ],
})
export class CustomerPortalModule { }
