import { Module } from '@nestjs/common';
import { UmrahPackageService } from './umrah-package.service';
import { UmrahPackageController } from './umrah-package.controller';

@Module({
  controllers: [UmrahPackageController],
  providers: [UmrahPackageService],
})
export class UmrahPackageModule {}
