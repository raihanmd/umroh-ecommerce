import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResendService } from "nestjs-resend";

@Injectable()
export class MailerService {
  constructor(
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  async sendOTP(receiver: string, otp: string) {
    await this.resendService.send({
      from: `OTP Verification <${this.configService.get<string>("DEFAULT_MAILER_FROM")!}>`,
      to: receiver,
      subject: "OTP Confirmation",
      text: `Hello buddy, this is your otp, please confirm it: ${otp}`,
    });
  }
}
