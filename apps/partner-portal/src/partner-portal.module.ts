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
  AssetModule,
  DealerModule,
  ModelModule,
  ProductModule,
  WarrantyModule,
  WorkOrderModule,
  MasterDataModule,
  TechnicianModule,
  ChargeModule,
  InvoiceModule,
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
  WarrantiesController,
  MasterDataController,
  TechniciansController,
  ChargesController,
  InvoicesController,
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
    MasterDataModule,
    TechnicianModule,
    ChargeModule,
    InvoiceModule,
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
    AssetsController,
    ChargesController,
    CustomersController,
    DealersController,
    IndexController,
    InvoicesController,
    MasterDataController,
    ModelsController,
    ProductsController,
    RbacController,
    TechniciansController,
    UsersController,
    WarrantiesController,
    WorkOrderController,
  ],
  providers: [AuthService],
})
export class PartnerPortalModule { }
