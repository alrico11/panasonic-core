import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AuthenticationModule,
  CustomerModule,
  DatabaseModule,
  LibraryModule,
  RbacModule,
  SampleModule,
  UserModule,
  WorkOrderModule
} from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomersController } from './controllers/customers.controller';
import { AuthService } from './services/auth.service';
import { UsersController } from './controllers/users.controller';
import { WorkOrderController } from './controllers/work-order.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.partner-portal']
    }),
    AuthenticationModule,
    DatabaseModule,
    LibraryModule,
    SampleModule,
    CustomerModule,
    UserModule,
    RbacModule,
    WorkOrderModule
  ],
  controllers: [IndexController, CustomersController, UsersController, WorkOrderController],
  providers: [AuthService],
})
export class PartnerPortalModule { }
