import * as bcrypt from "bcrypt";
import { Logger } from "winston";
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";

import { PrismaService } from "../common/prisma/prisma.service";
import { ValidationService } from "../common/validation/validation.service";
import { UsersValidation } from "./zod";
import {
  LoginUserDto,
  RegisterHeaderDto,
  RegisterUserDto,
  VerifyUserDto,
} from "./dto";
import { LoginResponse, RegisterResponse } from "./response";
import { MailerService } from "src/common/mailer/mailer.service";
import { OtpService } from "src/common/otp/otp.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly validationService: ValidationService,
    private readonly mailerService: MailerService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    data: RegisterUserDto,
    header: RegisterHeaderDto,
  ): Promise<RegisterResponse | string> {
    const registerUser = this.validationService.validate(
      UsersValidation.RESGISTER,
      data,
    );

    const isAdminRegistration =
      header["x-admin-token"] === this.configService.get<string>("ADMIN_TOKEN");

    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        phone: registerUser.phone,
      },
    });

    if (isUserExist) throw new ForbiddenException("User already exist");

    registerUser.password = await bcrypt.hash(
      registerUser.password as string,
      10,
    );

    this.logger.info(`Register User: ${registerUser.phone}`);

    const user = await this.prismaService.user.create({
      data: {
        email: registerUser.email,
        phone: registerUser.phone!,
        password: registerUser.password,
        name: registerUser.name,
        role: isAdminRegistration ? UserRole.ADMIN : UserRole.MEMBER,
        is_verified: isAdminRegistration,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
    });

    if (user.role === UserRole.MEMBER) {
      const otp = await this.otpService.generateOtp(user.id);

      this.mailerService.sendOTP(user.email, otp);

      return {
        verify_token: this.jwtService.sign({
          id: user.id,
        }),
      };
    }

    return "Success";
  }

  async login(data: LoginUserDto): Promise<LoginResponse> {
    const loginUser = this.validationService.validate(
      UsersValidation.LOGIN,
      data,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        phone: loginUser.phone,
        is_verified: {
          equals: true,
        },
      },
    });

    if (!user) throw new UnauthorizedException("Username or password wrong");

    const isMatch = await bcrypt.compare(
      loginUser.password as string,
      user.password,
    );

    if (!isMatch) throw new UnauthorizedException("Username or password wrong");

    this.logger.info(`Login User: ${user.phone}`);

    return {
      token: this.jwtService.sign({
        id: user.id,
        phone: user.phone,
        role: user.role,
      }),
    };
  }

  async verify(data: VerifyUserDto): Promise<string> {
    const res = this.jwtService.decode<{ id: string }>(data.verify_token);

    await this.otpService.verifyOtp(data.otp, res.id);

    await this.prismaService.user.update({
      where: {
        id: res.id,
      },
      data: {
        is_verified: true,
      },
    });

    return "Success, user has been verified";
  }
}
