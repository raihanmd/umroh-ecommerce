import { ApiProperty } from "@nestjs/swagger";

export class CreateCartItemDto {
  @ApiProperty({ type: String, required: true })
  umrah_package_id!: string;

  @ApiProperty({ type: Number, required: true })
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ type: String, required: true })
  umrah_package_id!: string;

  @ApiProperty({ type: Number, required: true })
  quantity!: number;
}

export class DeleteCartDto {
  @ApiProperty({ type: String })
  umrah_package_id!: string;
}
