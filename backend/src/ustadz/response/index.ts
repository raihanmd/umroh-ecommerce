import { ApiProperty } from "@nestjs/swagger";

import { UstadzEntity } from "../entity";
import {
  WebPaginationResponse,
  WebSuccessResponse,
} from "src/common/response/base-response";

export class CreateUstadzResponse {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;
}

export class UpdateUstadzDtoResponse extends CreateUstadzResponse {}

export class WebGetAllUstadzResponse extends WebPaginationResponse<
  UstadzEntity[]
> {
  @ApiProperty({ type: [UstadzEntity] })
  payload!: UstadzEntity[];
}

export class WebGetUstadzResponse extends WebSuccessResponse<UstadzEntity> {
  @ApiProperty({ type: UstadzEntity })
  payload!: UstadzEntity;
}

export class WebCreateUstadzResponse extends WebSuccessResponse<CreateUstadzResponse> {
  @ApiProperty({ type: CreateUstadzResponse })
  payload!: CreateUstadzResponse;
}

export class WebUpdateUstadzDtoResponse extends WebSuccessResponse<UpdateUstadzDtoResponse> {
  @ApiProperty({ type: UpdateUstadzDtoResponse })
  payload!: UpdateUstadzDtoResponse;
}
