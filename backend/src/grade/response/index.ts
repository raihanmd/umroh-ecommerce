import { ApiProperty } from "@nestjs/swagger";

import { GradeEntity } from "../entity";
import { WebSuccessResponse } from "src/common/response/base-response";

export class CreateGradeResponse {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;
}

export class UpdateGradeDtoResponse extends CreateGradeResponse {}

export class WebGetAllGradeResponse extends WebSuccessResponse<GradeEntity[]> {
  @ApiProperty({ type: [GradeEntity] })
  payload!: GradeEntity[];
}

export class WebCreateGradeResponse extends WebSuccessResponse<CreateGradeResponse> {
  @ApiProperty({ type: CreateGradeResponse })
  payload!: CreateGradeResponse;
}

export class WebUpdateGradeDtoResponse extends WebSuccessResponse<UpdateGradeDtoResponse> {
  @ApiProperty({ type: UpdateGradeDtoResponse })
  payload!: UpdateGradeDtoResponse;
}
