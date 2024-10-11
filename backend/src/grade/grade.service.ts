import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ValidationService } from "src/common/validation/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { GradeValidation } from "./zod";
import { CreateGradeDto, UpdateGradeDto } from "./dto";
import { CreateGradeResponse } from "./response";
import { GradeEntity } from "./entity";

@Injectable()
export class GradeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async create(data: CreateGradeDto): Promise<CreateGradeResponse> {
    const gradeReq = this.validationService.validate(
      GradeValidation.CREATE,
      data,
    );

    this.logger.info(`Create Grade: ${gradeReq.name}`);

    return this.prismaService.grade.create({
      data: gradeReq,
    });
  }

  async getAll(): Promise<GradeEntity[]> {
    return await this.prismaService.grade.findMany();
  }

  async update(id: string, data: UpdateGradeDto): Promise<GradeEntity> {
    const validatedData = this.validationService.validate(
      GradeValidation.UPDATE,
      data,
    );

    const grade = await this.prismaService.grade.findUnique({
      where: { id },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    this.logger.info(`Update Grade: ${id}`);

    return this.prismaService.grade.update({
      where: { id },
      data: validatedData,
    });
  }

  async delete(id: string): Promise<string> {
    const grade = await this.prismaService.grade.deleteMany({
      where: { id },
    });

    if (grade.count === 0) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    this.logger.info(`Delete Grade: ${id}`);

    return "Success";
  }
}
