import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule, CustomerModule, LibraryModule, DatabaseModule, SampleModule, AccessTokenGuard, RbacModule } from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomerController } from './controllers/customer.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.customer-portal']
    }),
    AuthenticationModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule,
    RbacModule
  ],
  controllers: [IndexController, CustomerController],
  providers: [
    {
      // Use auth guard for all controller, except it has @NoLogin decorator
      provide: APP_GUARD,
      useExisting: AccessTokenGuard
    }
  ],
})
export class CustomerPortalModule { }
