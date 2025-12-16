import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule, CustomerModule, LibraryModule, RbacModule } from '@lib';
import { DatabaseModule } from '@lib';
import { SampleModule } from '@lib';
import { IndexController } from './controllers/index.controller';
import { CustomersController } from './controllers/customers.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.partner-portal.local', '.env.partner-portal']
    }),
    AuthenticationModule,
    DatabaseModule,
    CustomerModule,
    LibraryModule,
    RbacModule
  ],
  controllers: [IndexController, CustomersController],
  providers: [],
})
export class PartnerPortalModule { }
