import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CartService } from "src/cart/cart.service";
import { OrderService } from "src/order/order.service";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [CartService, OrderService, UserService],
  exports: [UserService],
})
export class UserModule {}
