import {
  Controller,
  HttpCode,
  UseInterceptors,
  Body,
  Post,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UploadedFiles,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ResponseService } from "src/common/response/response.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import {
  WebBadRequestErrorResponse,
  WebInternalServerErrorResponse,
  WebPayloadStringResponse,
  WebUnauthorizedErrorResponse,
} from "src/common/response/base-response";
import { Public } from "src/common/decorators/public.decorator";
import {
  CreateUmrahPackageDto,
  QueryUmrahPackageDto,
  UpdateUmrahPackageDto,
} from "./dto";
import {
  WebCreateUmrahPackageResponse,
  WebGetAllUmrahPackageResponse,
  WebGetUmrahPackageResponse,
  WebUpdateUmrahPackageDtoResponse,
} from "./response";
import { UmrahPackageService } from "./umrah-package.service";

@ApiTags("Umrah Packae")
@Controller("umrah-packages")
export class UmrahPackageController {
  constructor(
    private readonly umrahService: UmrahPackageService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: CreateUmrahPackageDto })
  @ApiOkResponse({ type: WebCreateUmrahPackageResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createReq: CreateUmrahPackageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<WebCreateUmrahPackageResponse> {
    const photo_urls = files.filter((file) =>
      file.mimetype.startsWith("image"),
    );
    const video_urls = files.filter((file) =>
      file.mimetype.startsWith("video"),
    );

    const res = await this.umrahService.create({
      ...createReq,
      photo_urls,
      video_urls,
    });
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
  @ApiOkResponse({ type: WebGetAllUmrahPackageResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Get()
  async getAll(
    @Query() query: QueryUmrahPackageDto,
  ): Promise<WebGetAllUmrahPackageResponse> {
    const res = await this.umrahService.getAll(query);
    return this.responseService.pagination(200, res.payload, res.meta);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebGetUmrahPackageResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Get(":id")
  async get(@Param("id") id: string): Promise<WebGetUmrahPackageResponse> {
    const res = await this.umrahService.getById(id);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUmrahPackageDto })
  @ApiOkResponse({ type: WebUpdateUmrahPackageDtoResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Put(":id")
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param("id") id: string,
    @Body() createReq: UpdateUmrahPackageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<WebUpdateUmrahPackageDtoResponse> {
    const photo_urls = files.filter((file) =>
      file.mimetype.startsWith("image"),
    );
    const video_urls = files.filter((file) =>
      file.mimetype.startsWith("video"),
    );

    const res = await this.umrahService.update(id, {
      ...createReq,
      photo_urls,
      video_urls,
    });
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
    await this.umrahService.delete(id);
    return this.responseService.success(200, "Success");
  }
}
