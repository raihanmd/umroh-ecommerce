import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ValidationService } from "src/common/validation/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Prisma } from "@prisma/client";
import { WithPagiation } from "src/common/types";
import { FirebaseService } from "src/common/firebase/firebase.service";
import {
  CreateUmrahPackageDto,
  QueryUmrahPackageDto,
  UpdateUmrahPackageDto,
} from "./dto";
import { CreateUmrahPackageResponse } from "./response";
import { UmrahPackageValidation } from "./zod";
import { UmrahPackageEntity } from "./entity";

@Injectable()
export class UmrahPackageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    data: CreateUmrahPackageDto,
  ): Promise<CreateUmrahPackageResponse> {
    const validatedData = this.validationService.validate(
      UmrahPackageValidation.CREATE,
      {
        ...data,
        price: +data.price,
      },
    );

    const photoUrls = await this.firebaseService.uploadMany(data.photo_urls);
    const videoUrls = await this.firebaseService.uploadMany(data.video_urls);

    const newUmrahPackage = {
      ...validatedData,
      photo_urls: JSON.stringify(photoUrls),
      video_urls: JSON.stringify(videoUrls),
    };

    this.logger.info(`Create Umrah Package: ${newUmrahPackage.name}`);

    return await this.prismaService.umrahPackage.create({
      data: newUmrahPackage,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        grade: {
          select: {
            name: true,
          },
        },
        ustadz: {
          select: {
            name: true,
          },
        },
        photo_urls: true,
        video_urls: true,
      },
    });
  }

  async getAll(
    queryDto: QueryUmrahPackageDto,
  ): Promise<WithPagiation<UmrahPackageEntity[]>> {
    const queryReq = this.validationService.validate(
      UmrahPackageValidation.QUERY,
      {
        page: +queryDto.page || 1,
        limit: +queryDto.limit || 10,
        name: queryDto.name,
      },
    ) as QueryUmrahPackageDto;

    const skip = (queryReq.page - 1) * queryReq.limit;

    const filter: Prisma.UmrahPackageWhereInput = {};

    if (queryReq.name) {
      filter.name = {
        search: decodeURI(queryReq.name),
      };
    }

    const [payload, total] = await this.prismaService.$transaction([
      this.prismaService.umrahPackage.findMany({
        orderBy: {
          created_at: "desc",
        },
        omit: {
          ustadz_id: true,
          grade_id: true,
        },
        include: {
          grade: {
            select: {
              name: true,
            },
          },
          ustadz: {
            select: {
              name: true,
            },
          },
        },
        where: filter,
        take: queryReq.limit,
        skip,
      }),
      this.prismaService.umrahPackage.count({
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

  async update(
    id: string,
    data: UpdateUmrahPackageDto,
  ): Promise<UmrahPackageEntity> {
    const validatedData = this.validationService.validate(
      UmrahPackageValidation.UPDATE,
      {
        ...data,
        price: +data.price,
      },
    );

    const umrahPackage = await this.prismaService.umrahPackage.findUnique({
      where: { id },
    });

    if (!umrahPackage) {
      throw new NotFoundException(`Umrah Package with ID ${id} not found`);
    }

    let newPhotoUrls = umrahPackage.photo_urls;
    let newVideoUrls = umrahPackage.video_urls;

    if (validatedData.photo_urls) {
      const oldPhotoUrls = JSON.parse(umrahPackage.photo_urls);
      await this.firebaseService.deleteMany(oldPhotoUrls);
      const uploadedPhotoUrls = await this.firebaseService.uploadMany(
        validatedData.photo_urls,
      );
      newPhotoUrls = JSON.stringify(uploadedPhotoUrls);
    }

    if (validatedData.video_urls) {
      const oldVideoUrls = JSON.parse(umrahPackage.video_urls);
      await this.firebaseService.deleteMany(oldVideoUrls);
      const uploadedVideoUrls = await this.firebaseService.uploadMany(
        validatedData.video_urls,
      );
      newVideoUrls = JSON.stringify(uploadedVideoUrls);
    }

    this.logger.info(`Update Umrah Package: ${id}`);

    const updateData = {
      ...validatedData,
      photo_urls: newPhotoUrls,
      video_urls: newVideoUrls,
    };

    return await this.prismaService.umrahPackage.update({
      where: { id },
      data: updateData,
      include: {
        grade: {
          select: {
            name: true,
          },
        },
        ustadz: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<string> {
    const umrahPackage = await this.prismaService.umrahPackage.findUnique({
      where: { id },
    });

    if (!umrahPackage) {
      throw new NotFoundException(`Umrah Package with ID ${id} not found`);
    }

    const photoUrls = JSON.parse(umrahPackage.photo_urls);
    const videoUrls = JSON.parse(umrahPackage.video_urls);
    await this.firebaseService.deleteMany([...photoUrls, ...videoUrls]);

    await this.prismaService.umrahPackage.delete({
      where: { id },
    });

    this.logger.info(`Delete Umrah Package: ${id}`);

    return "Success";
  }

  async getById(id: string): Promise<UmrahPackageEntity> {
    const umrahPackage = await this.prismaService.umrahPackage.findUnique({
      where: { id },
      omit: {
        ustadz_id: true,
        grade_id: true,
      },
      include: {
        grade: {
          select: {
            name: true,
          },
        },
        ustadz: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!umrahPackage) {
      throw new NotFoundException(`Umrah Package with ID ${id} not found`);
    }

    return umrahPackage;
  }
}
