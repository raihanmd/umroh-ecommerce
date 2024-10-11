import { Module } from '@nestjs/common';
import { UstadzService } from './ustadz.service';
import { UstadzController } from './ustadz.controller';

@Module({
  controllers: [UstadzController],
  providers: [UstadzService],
})
export class UstadzModule {}
