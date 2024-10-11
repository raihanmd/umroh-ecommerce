import { ApiProperty, PickType } from "@nestjs/swagger";
import { GradeEntity } from "src/grade/entity";
import { UstadzEntity } from "src/ustadz/entity";

export class UmrahPackageEntity {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: PickType(UstadzEntity, ["name"]) })
  ustadz!: Pick<UstadzEntity, "name">;

  @ApiProperty({ type: PickType(GradeEntity, ["name"]) })
  grade!: Pick<GradeEntity, "name">;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;

  @ApiProperty({ type: Float64Array })
  price!: number;

  @ApiProperty({ type: String })
  photo_urls!: string;

  @ApiProperty({ type: String })
  video_urls!: string;
}
