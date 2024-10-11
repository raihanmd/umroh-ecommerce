import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User, UserRole } from "@prisma/client";
import { CartService } from "src/cart/cart.service";
import { WebCartItemsResponse } from "src/cart/response";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { ResponseService } from "src/common/response/response.service";
import { OrderService } from "src/order/order.service";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly responseService: ResponseService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(200)
  @ApiOkResponse({ type: WebCartItemsResponse })
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Get("/cart")
  async getCart(@CurrentUser() user: User): Promise<WebCartItemsResponse> {
    const res = await this.cartService.get(user.id);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Get("/order")
  async getOrders(@CurrentUser() user: User) {
    const res = await this.orderService.getOrderHistory(user);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @Roles([UserRole.ADMIN])
  @Get()
  async getAll() {
    const res = await this.userService.getAll();
    return this.responseService.success(200, res);
  }
}
