import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartItemDto, DeleteCartDto, UpdateCartItemDto } from "./dto";
import { WebCartItemResponse, WebCartItemsResponse } from "./response";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ResponseService } from "src/common/response/response.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { User, UserRole } from "@prisma/client";
import {
  WebBadRequestErrorResponse,
  WebForbiddenErrorResponse,
  WebInternalServerErrorResponse,
  WebPayloadStringResponse,
  WebUnauthorizedErrorResponse,
} from "src/common/response/base-response";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@ApiTags("Cart")
@Controller("carts")
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiCreatedResponse({ type: WebCartItemResponse })
  @ApiForbiddenResponse({ type: WebForbiddenErrorResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Post()
  async create(
    @Body() createReq: CreateCartItemDto,
    @CurrentUser() user: User,
  ): Promise<WebCartItemResponse> {
    const res = await this.cartService.create(createReq, user);
    return this.responseService.success(201, res);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebCartItemResponse })
  @ApiForbiddenResponse({ type: WebForbiddenErrorResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Put()
  async update(
    @Body()
    updateReq: UpdateCartItemDto,
    @CurrentUser() user: User,
  ): Promise<WebCartItemResponse> {
    const res = await this.cartService.update(updateReq, user);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebCartItemsResponse })
  @ApiForbiddenResponse({ type: WebForbiddenErrorResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiBearerAuth()
  @Roles([UserRole.ADMIN])
  @Get()
  async get(): Promise<WebCartItemsResponse> {
    const res = await this.cartService.getAll();
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebPayloadStringResponse })
  @ApiForbiddenResponse({ type: WebForbiddenErrorResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiBearerAuth()
  @Roles([UserRole.MEMBER])
  @Delete()
  async delete(
    @Body() deleteReq: DeleteCartDto,
    @CurrentUser() user: User,
  ): Promise<WebPayloadStringResponse> {
    const res = await this.cartService.delete(deleteReq, user);
    return this.responseService.success(200, res);
  }
}
