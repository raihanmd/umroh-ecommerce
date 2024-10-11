import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";
import { UmrahPackageValidation } from "../zod";

export class CreateUmrahPackageDto {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({ type: String, required: true })
  description!: string;

  @ApiProperty({ type: String, required: true })
  ustadz_id!: string;

  @ApiProperty({ type: String, required: true })
  grade_id!: string;

  @ApiProperty({ type: Number, required: true })
  price!: number;

  @ApiProperty({ type: "file", format: "binary", required: true })
  photo_urls!: Express.Multer.File[];

  @ApiProperty({ type: "file", format: "binary", required: true })
  video_urls!: Express.Multer.File[];
}

export class UpdateUmrahPackageDto extends CreateUmrahPackageDto {}

export type QueryUmrahPackageDto = z.infer<typeof UmrahPackageValidation.QUERY>;
