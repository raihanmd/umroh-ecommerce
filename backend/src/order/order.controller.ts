import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { User, UserRole } from "@prisma/client";
import { CreateOrderDto } from "./dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ResponseService } from "src/common/response/response.service";
import { PaginationReq } from "src/common/types";

@ApiTags("Order")
@Controller("order")
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(200)
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Post()
  async create(@Body() data: CreateOrderDto, @CurrentUser() user: User) {
    const res = await this.orderService.create(data, user);
    return this.responseService.success(201, res);
  }

  @HttpCode(200)
  @ApiQuery({
    name: "page",
    type: Number,
    example: 1,
    required: false,
    allowReserved: true,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    example: 10,
    required: false,
    allowReserved: true,
  })
  @ApiBearerAuth()
  @Roles([UserRole.ADMIN])
  @Get()
  async getAll(@Query() query: PaginationReq) {
    const res = await this.orderService.getAll(query);
    return this.responseService.success(201, res);
  }
}
