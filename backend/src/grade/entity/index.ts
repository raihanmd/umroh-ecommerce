import { ApiProperty } from "@nestjs/swagger";

export class GradeEntity {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;
}
