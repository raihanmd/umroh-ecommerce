import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({ type: Array<String> })
  items!: string[];
}
