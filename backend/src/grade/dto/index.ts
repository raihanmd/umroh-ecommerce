import { ApiProperty } from "@nestjs/swagger";

export class CreateGradeDto {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({ type: String, required: true })
  description!: string;
}

export class UpdateGradeDto extends CreateGradeDto {}
