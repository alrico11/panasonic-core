import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AuthenticationModule,
  CustomerModule,
  DatabaseModule,
  LibraryModule,
  RbacModule,
  SampleModule
} from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomersController } from './controllers/customers.controller';
import { AuthService } from './services/auth.service';

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
    RbacModule
  ],
  controllers: [IndexController, CustomersController],
  providers: [AuthService],
})
export class PartnerPortalModule { }
