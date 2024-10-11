import { ApiProperty } from "@nestjs/swagger";

import { WebSuccessResponse } from "../../common/response/base-response";

export class LoginResponse {
  @ApiProperty({ type: String })
  token!: string;
}

export class RegisterResponse {
  @ApiProperty({ type: String })
  verify_token!: string;
}

export class WebLoginResponse extends WebSuccessResponse<LoginResponse> {
  @ApiProperty({ type: LoginResponse })
  payload!: LoginResponse;
}

export class WebRegisterResponse extends WebSuccessResponse<RegisterResponse> {
  @ApiProperty({ type: RegisterResponse })
  payload!: RegisterResponse;
}
