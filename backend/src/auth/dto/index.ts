import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ type: String, required: true })
  phone!: string;

  @ApiProperty({ type: String, required: true })
  password!: string;
}

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({ type: String, required: true })
  email!: string;

  @ApiProperty({ type: String, required: true })
  confirm_password!: string;
}

export class VerifyUserDto {
  @ApiProperty({ type: String, required: true })
  verify_token!: string;

  @ApiProperty({ type: String, required: true })
  otp!: string;
}

export class RegisterHeaderDto {
  @ApiProperty({ type: String })
  "x-admin-token"?: string;
}
