import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OtpService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateOtp(userId: string) {
    const otp = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    await this.prismaService.otp.create({
      data: {
        user_id: userId,
        otp,
      },
    });

    return otp;
  }

  async verifyOtp(otp: string, userId: string) {
    const otpData = await this.prismaService.otp.deleteMany({
      where: {
        otp,
        user_id: userId,
      },
    });

    if (otpData.count === 0) {
      throw new ForbiddenException("Invalid OTP");
    }
  }
}
