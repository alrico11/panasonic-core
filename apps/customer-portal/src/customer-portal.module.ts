import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexController } from './controllers/index.controller';
import { CustomerController } from './controllers/customer.controller';
import {
  AuthenticationModule, CustomerModule, LibraryModule, DatabaseModule,
  SampleModule, AccessTokenGuard, RbacModule, UserModule,
  OtpModule
} from '@lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.customer-portal']
    }),
    AuthenticationModule,
    OtpModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule,
    UserModule,
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
