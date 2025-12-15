import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule, CustomerModule, LibraryModule, DatabaseModule, SampleModule, AccessTokenGuard } from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomersController } from './controllers/customers.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.customer-portal', '.env.local', '.env']
    }),
    AuthenticationModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule
  ],
  controllers: [IndexController, CustomerController, CustomersController],
  providers: [
    {
      // Use auth guard for all controller, except it has @NoLogin decorator
      provide: APP_GUARD,
      useExisting: AccessTokenGuard
    }
  ],
})
export class CustomerPortalModule { }
