import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AuthenticationModule,
  CustomerModule,
  DatabaseModule,
  LibraryModule,
  PartnerModule,
  RbacModule,
  SampleModule,
  TokenApp,
  UserModule,
  WorkOrderModule
} from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomersController } from './controllers/customers.controller';
import { AuthService } from './services/auth.service';
import { UsersController } from './controllers/users.controller';
import { RbacController } from './controllers/rbac.controller';
import { WorkOrderController } from './controllers/work-order.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({
        TOKEN_APP_TYPE_ALLOWED: TokenApp.PARTNER
      })],
      envFilePath: ['.env.local', '.env.partner-portal']
    }),
    AuthenticationModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule,
    UserModule,
    PartnerModule,
    RbacModule,
    WorkOrderModule
  ],
  controllers: [IndexController, CustomersController, UsersController, RbacController, WorkOrderController],
  providers: [AuthService],
})
export class PartnerPortalModule { }
