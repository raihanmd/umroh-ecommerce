import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/auth/entity";

export class CartItemEntity {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  user_id!: string;

  @ApiProperty({ type: UserEntity })
  user!: UserEntity;

  @ApiProperty({ type: String })
  umrah_package_id!: string;

  @ApiProperty({ type: Number })
  quantity!: number;

  @ApiProperty({ type: Number })
  total_price!: number;

  @ApiProperty({ type: Date })
  created_at!: Date;

  @ApiProperty({ type: Date })
  updated_at!: Date;
}
