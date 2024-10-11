import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ValidationService } from "src/common/validation/validation.service";
import { CreateUstadzDto, QueryUstadzDto, UpdateUstadzDto } from "./dto";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { UstadzValidation } from "./zod";
import { CreateUstadzResponse } from "./response";
import { Prisma } from "@prisma/client";
import { UstadzEntity } from "./entity";
import { WithPagiation } from "src/common/types";
import { FirebaseService } from "src/common/firebase/firebase.service";

@Injectable()
export class UstadzService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(data: CreateUstadzDto): Promise<CreateUstadzResponse> {
    const validatedData = this.validationService.validate(
      UstadzValidation.CREATE,
      data,
    );

    this.logger.info(`Create Ustadz: ${validatedData.name}`);

    return this.prismaService.ustadz.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async getAll(
    queryDto: QueryUstadzDto,
  ): Promise<WithPagiation<UstadzEntity[]>> {
    const queryReq = this.validationService.validate(UstadzValidation.QUERY, {
      page: +queryDto.page || 1,
      limit: +queryDto.limit || 10,
      name: queryDto.name,
    }) as QueryUstadzDto;

    const skip = (queryReq.page - 1) * queryReq.limit;

    const filter: Prisma.UstadzWhereInput = {};

    if (queryReq.name) {
      filter.name = {
        search: decodeURI(queryReq.name),
      };
    }

    const [payload, total] = await this.prismaService.$transaction([
      this.prismaService.ustadz.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: filter,
        take: queryReq.limit,
        skip,
      }),
      this.prismaService.ustadz.count({
        where: filter,
      }),
    ]);

    return {
      payload,
      meta: {
        page: queryReq.page,
        limit: queryReq.limit,
        total_data: total,
        total_page: Math.ceil(total / queryReq.limit),
      },
    };
  }

  async update(id: string, data: UpdateUstadzDto): Promise<UstadzEntity> {
    const validatedData = this.validationService.validate(
      UstadzValidation.UPDATE,
      data,
    );

    const ustadz = await this.prismaService.ustadz.findUnique({
      where: { id },
    });
    if (!ustadz) {
      throw new NotFoundException(`Ustadz with ID ${id} not found`);
    }

    this.logger.info(`Update Ustadz: ${id}`);

    return this.prismaService.ustadz.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async delete(id: string): Promise<string> {
    const ustadz = await this.prismaService.ustadz.findUnique({
      where: { id },
    });

    if (!ustadz) {
      throw new NotFoundException(`Ustadz with ID ${id} not found`);
    }

    await this.prismaService.ustadz.delete({
      where: { id },
    });

    this.logger.info(`Delete Ustadz: ${id}`);

    return "Success";
  }

  async getById(id: string): Promise<UstadzEntity> {
    const ustadz = await this.prismaService.ustadz.findUnique({
      where: { id },
    });
    if (!ustadz) {
      throw new NotFoundException(`Ustadz with ID ${id} not found`);
    }

    return ustadz;
  }
}
