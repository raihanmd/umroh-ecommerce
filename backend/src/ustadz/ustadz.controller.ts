import {
  Controller,
  HttpCode,
  Body,
  Post,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { UstadzService } from "./ustadz.service";
import { ResponseService } from "src/common/response/response.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUstadzDto, QueryUstadzDto, UpdateUstadzDto } from "./dto";
import { Roles } from "src/common/decorators/roles.decorator";
import {
  WebCreateUstadzResponse,
  WebGetAllUstadzResponse,
  WebGetUstadzResponse,
  WebUpdateUstadzDtoResponse,
} from "./response";
import { UserRole } from "@prisma/client";
import {
  WebBadRequestErrorResponse,
  WebInternalServerErrorResponse,
  WebPayloadStringResponse,
  WebUnauthorizedErrorResponse,
} from "src/common/response/base-response";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("Ustadz")
@Controller("ustadzs")
export class UstadzController {
  constructor(
    private readonly ustadzService: UstadzService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: CreateUstadzDto })
  @ApiOkResponse({ type: WebCreateUstadzResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Post()
  async create(
    @Body() createReq: CreateUstadzDto,
  ): Promise<WebCreateUstadzResponse> {
    const res = await this.ustadzService.create(createReq);
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
  @ApiQuery({
    name: "name",
    type: String,
    required: false,
    allowReserved: true,
  })
  @ApiOkResponse({ type: WebGetAllUstadzResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Get()
  async getAll(
    @Query() query: QueryUstadzDto,
  ): Promise<WebGetAllUstadzResponse> {
    const res = await this.ustadzService.getAll(query);
    return this.responseService.pagination(200, res.payload, res.meta);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebGetUstadzResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Get(":id")
  async get(@Param("id") id: string): Promise<WebGetUstadzResponse> {
    const res = await this.ustadzService.getById(id);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUstadzDto })
  @ApiOkResponse({ type: WebUpdateUstadzDtoResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() createReq: UpdateUstadzDto,
  ): Promise<WebUpdateUstadzDtoResponse> {
    const res = await this.ustadzService.update(id, createReq);
    return this.responseService.success(201, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ type: WebPayloadStringResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<WebPayloadStringResponse> {
    await this.ustadzService.delete(id);
    return this.responseService.success(200, "Success");
  }
}
