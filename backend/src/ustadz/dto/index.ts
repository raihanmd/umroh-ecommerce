import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";
import { UstadzValidation } from "../zod";

export class CreateUstadzDto {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({ type: String, required: true })
  description!: string;
}

export class UpdateUstadzDto extends CreateUstadzDto {}

export type QueryUstadzDto = z.infer<typeof UstadzValidation.QUERY>;
