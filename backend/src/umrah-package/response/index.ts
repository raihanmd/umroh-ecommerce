import { ApiProperty, PickType } from "@nestjs/swagger";
import {
  WebPaginationResponse,
  WebSuccessResponse,
} from "src/common/response/base-response";
import { UmrahPackageEntity } from "../entity";
import { UstadzEntity } from "src/ustadz/entity";
import { GradeEntity } from "src/grade/entity";

export class CreateUmrahPackageResponse {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;

  @ApiProperty({ type: PickType(UstadzEntity, ["name"]) })
  ustadz!: Pick<UstadzEntity, "name">;

  @ApiProperty({ type: PickType(GradeEntity, ["name"]) })
  grade!: Pick<GradeEntity, "name">;

  @ApiProperty({ type: Number })
  price!: number;

  @ApiProperty({ type: String })
  photo_urls!: string;

  @ApiProperty({ type: String })
  video_urls!: string;
}

export class UpdateUmrahPackageDtoResponse extends CreateUmrahPackageResponse {}

export class WebGetAllUmrahPackageResponse extends WebPaginationResponse<
  UmrahPackageEntity[]
> {
  @ApiProperty({ type: [UmrahPackageEntity] })
  payload!: UmrahPackageEntity[];
}

export class WebGetUmrahPackageResponse extends WebSuccessResponse<UmrahPackageEntity> {
  @ApiProperty({ type: UmrahPackageEntity })
  payload!: UmrahPackageEntity;
}

export class WebCreateUmrahPackageResponse extends WebSuccessResponse<CreateUmrahPackageResponse> {
  @ApiProperty({ type: CreateUmrahPackageResponse })
  payload!: CreateUmrahPackageResponse;
}

export class WebUpdateUmrahPackageDtoResponse extends WebSuccessResponse<UpdateUmrahPackageDtoResponse> {
  @ApiProperty({ type: UpdateUmrahPackageDtoResponse })
  payload!: UpdateUmrahPackageDtoResponse;
}
