import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { SwaggerAssetsModule } from "./swagger-assets/swagger-assets.module";
import { UstadzModule } from "./ustadz/ustadz.module";
import { GradeModule } from "./grade/grade.module";
import { UmrahPackageModule } from "./umrah-package/umrah-package.module";
import { CartModule } from './cart/cart.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    SwaggerAssetsModule,
    UstadzModule,
    GradeModule,
    UmrahPackageModule,
    CartModule,
    UserModule,
    OrderModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
