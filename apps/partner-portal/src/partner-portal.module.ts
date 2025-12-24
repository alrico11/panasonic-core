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
  WorkOrderModule,
  AssetModule,
  DealerModule,
  ModelModule,
  ProductModule,
  WarrantyModule,
} from '@lib';
import { AuthService } from './services/auth.service';
import {
  IndexController,
  CustomersController,
  UsersController,
  RbacController,
  WorkOrderController,
  AssetsController,
  DealersController,
  ModelsController,
  ProductsController,
  WarrantiesController
} from './controllers';
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
    WorkOrderModule,
    AssetModule,
    DealerModule,
    ModelModule,
    ProductModule,
    WarrantyModule
  ],
  controllers: [
    IndexController, CustomersController, UsersController, RbacController, WorkOrderController,
    AssetsController, DealersController, ModelsController, ProductsController, WarrantiesController,
  ],
  providers: [AuthService],
})
export class PartnerPortalModule { }
