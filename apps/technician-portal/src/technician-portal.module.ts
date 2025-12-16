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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.technician-portal', '.env']
    }),
    AuthenticationModule,
    DatabaseModule,
    SampleModule,
    LibraryModule,
    CustomerModule,
    RbacModule,
  ],
  controllers: [IndexController, CustomersController],
  providers: [],
})
export class TechnicianPortalModule { }
