import { ApiProperty } from "@nestjs/swagger";

export class UstadzEntity {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;

  @ApiProperty({ type: Date })
  created_at!: Date;

  @ApiProperty({ type: Date })
  updated_at!: Date;
}
