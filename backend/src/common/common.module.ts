import * as winston from "winston";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { WinstonModule } from "nest-winston";

import { PrismaService } from "./prisma/prisma.service";
import { ValidationService } from "./validation/validation.service";
import { ResponseService } from "./response/response.service";
import { ErrorFilter } from "./error/error.filter";
import { JwtGuard } from "./guards/jwt.guard";
import { ResendModule } from "nestjs-resend";
import { MailerService } from "./mailer/mailer.service";
import { OtpService } from "./otp/otp.service";
import { FirebaseService } from "./firebase/firebase.service";

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.combine(
          winston.format.ms(),
          winston.format.timestamp({
            format: "DD/MM/YYYY dddd HH:mm:ss",
          }),
          winston.format.printf(
            (info) =>
              `${info.timestamp} - [${info.level}] : ${info.message} ${info.ms || ""}`,
          ),
        ),
      ),
      level: "debug",
      transports: [
        new winston.transports.Console({
          format: winston.format.colorize({ all: true }),
        }),
      ],
    }),
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>("RESEND_API_KEY")!,
      }),
    }),
  ],
  providers: [
    ValidationService,
    ResponseService,
    PrismaService,
    MailerService,
    OtpService,
    FirebaseService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [
    ValidationService,
    ResponseService,
    PrismaService,
    MailerService,
    OtpService,
    FirebaseService,
  ],
})
export class CommonModule {}
