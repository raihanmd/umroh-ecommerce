import { ApiProperty, PickType } from "@nestjs/swagger";

import { WebSuccessResponse } from "src/common/response/base-response";
import { UmrahPackageEntity } from "src/umrah-package/entity";

export class CartItemResponse {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  user_id!: string;

  @ApiProperty({ type: String })
  umrah_package_id!: string;

  @ApiProperty({
    type: PickType(UmrahPackageEntity, [
      "name",
      "price",
      "photo_urls",
      "description",
    ]),
  })
  umrah_package?: Pick<
    UmrahPackageEntity,
    "name" | "price" | "photo_urls" | "description"
  >;

  @ApiProperty({ type: Number })
  quantity!: number;

  @ApiProperty({ type: Number })
  total_price!: number;

  @ApiProperty({ type: Date })
  created_at!: Date;

  @ApiProperty({ type: Date })
  updated_at!: Date;
}

export class WebCartItemResponse extends WebSuccessResponse<CartItemResponse> {
  @ApiProperty({ type: CartItemResponse })
  payload!: CartItemResponse;
}

export class WebCartItemsResponse extends WebSuccessResponse<
  CartItemResponse[]
> {
  @ApiProperty({ type: CartItemResponse, isArray: true })
  payload!: CartItemResponse[];
}
