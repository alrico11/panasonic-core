import { APP_GUARD } from '@nestjs/core';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexController } from './controllers/index.controller';
import { CustomerController } from './controllers/customer.controller';
import {
  AuthenticationModule, CustomerModule, LibraryModule, DatabaseModule,
  SampleModule, AccessTokenGuard, RbacModule, UserModule,
  OtpModule,
  TokenApp
} from '@lib';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({
        TOKEN_APP_TYPE_ALLOWED: TokenApp.CUSTOMER
      })],
      envFilePath: ['.env.local', '.env.customer-portal'],
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
    AuthService,
    {
      // Use auth guard for all controller, except it has @NoLogin decorator
      provide: APP_GUARD,
      useExisting: AccessTokenGuard
    }
  ]
})
export class CustomerPortalModule { }
