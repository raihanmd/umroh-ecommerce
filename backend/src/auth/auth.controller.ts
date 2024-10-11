import { Body, Controller, HttpCode, Post, Headers } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import {
  LoginUserDto,
  RegisterHeaderDto,
  RegisterUserDto,
  VerifyUserDto,
} from "./dto";
import {
  RegisterResponse,
  WebLoginResponse,
  WebRegisterResponse,
} from "./response";
import { ResponseService } from "src/common/response/response.service";
import {
  WebBadRequestErrorResponse,
  WebForbiddenErrorResponse,
  WebInternalServerErrorResponse,
  WebPayloadStringResponse,
  WebSuccessResponse,
} from "src/common/response/base-response";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ type: WebRegisterResponse })
  @ApiForbiddenResponse({ type: WebForbiddenErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Post("/register")
  async register(
    @Body() loginReq: RegisterUserDto,
    @Headers() headers: RegisterHeaderDto,
  ): Promise<WebSuccessResponse<string | RegisterResponse>> {
    const res = await this.authService.register(loginReq, headers);
    return this.responseService.success(201, res);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: WebLoginResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiUnauthorizedResponse({ type: WebForbiddenErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Post("/login")
  async login(@Body() loginReq: LoginUserDto): Promise<WebLoginResponse> {
    const res = await this.authService.login(loginReq);
    return this.responseService.success(200, res);
  }

  @HttpCode(200)
  @ApiBody({ type: VerifyUserDto })
  @ApiOkResponse({ type: WebPayloadStringResponse })
  @ApiBadRequestResponse({ type: WebBadRequestErrorResponse })
  @ApiInternalServerErrorResponse({ type: WebInternalServerErrorResponse })
  @Public()
  @Post("/verify")
  async verify(
    @Body() loginReq: VerifyUserDto,
  ): Promise<WebPayloadStringResponse> {
    const res = await this.authService.verify(loginReq);
    return this.responseService.success(200, res);
  }
}
