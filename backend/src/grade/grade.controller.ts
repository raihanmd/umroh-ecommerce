import {
  Controller,
  HttpCode,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { ResponseService } from "src/common/response/response.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
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
import { GradeService } from "./grade.service";
import { CreateGradeDto, UpdateGradeDto } from "./dto";
import {
  WebCreateGradeResponse,
  WebGetAllGradeResponse,
  WebUpdateGradeDtoResponse,
} from "./response";

@ApiTags("Grade")
@Controller("grades")
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: CreateGradeDto })
  @ApiOkResponse({ type: WebCreateGradeResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Post()
  async create(
    @Body() createReq: CreateGradeDto,
  ): Promise<WebCreateGradeResponse> {
    const res = await this.gradeService.create(createReq);
    return this.responseService.success(201, res);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: WebGetAllGradeResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Get()
  async getAll(): Promise<WebGetAllGradeResponse> {
    const res = await this.gradeService.getAll();
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateGradeDto })
  @ApiOkResponse({ type: WebUpdateGradeDtoResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebUnauthorizedErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles([UserRole.ADMIN])
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() createReq: UpdateGradeDto,
  ): Promise<WebUpdateGradeDtoResponse> {
    const res = await this.gradeService.update(id, createReq);
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
    await this.gradeService.delete(id);
    return this.responseService.success(200, "Success");
  }
}
