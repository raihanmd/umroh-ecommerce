import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateOrderDto } from "./dto";
import { ValidationService } from "src/common/validation/validation.service";
import { OrderValidation } from "./zod";
import { User } from "@prisma/client";
import { PaginationReq } from "src/common/types";
import { PaginationSchema } from "src/common/zod";

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async create(data: CreateOrderDto, user: User) {
    const validatedData = this.validationService.validate(
      OrderValidation.CREATE,
      {
        ...data,
        user_id: user.id,
      },
    );

    return this.prismaService.$transaction(async (prisma) => {
      const cartItems = await prisma.cartItem.findMany({
        where: {
          user_id: user.id,
          id: {
            in: validatedData.items,
          },
        },
        include: {
          umrah_package: true,
        },
      });

      if (cartItems.length === 0) {
        throw new Error("No valid cart items found");
      }

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.umrah_package.price * item.quantity,
        0,
      );

      const order = await prisma.order.create({
        data: {
          user_id: user.id,
          total_price: totalPrice,
          status: "PAID",
        },
      });

      await prisma.orderItem.createMany({
        data: cartItems.map((cartItem) => ({
          order_id: order.id,
          umrah_package_id: cartItem.umrah_package_id,
          quantity: cartItem.quantity,
          total_price: cartItem.umrah_package.price * cartItem.quantity,
        })),
      });

      await prisma.cartItem.deleteMany({
        where: {
          id: {
            in: cartItems.map((item) => item.id),
          },
        },
      });

      return order;
    });
  }

  async getOrderHistory(user: User) {
    const orders = await this.prismaService.order.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        order_items: {
          include: {
            umrah_package: {
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
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return orders;
  }

  async getAll(queryDto: PaginationReq) {
    const queryReq = this.validationService.validate(PaginationSchema, {
      page: +queryDto.page || 1,
      limit: +queryDto.limit || 10,
    }) as PaginationReq;

    const skip = (queryReq.page - 1) * queryReq.limit;

    const [payload, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        skip,
        take: queryReq.limit,
        select: {
          id: true,
          total_price: true,
          status: true,
          created_at: true,
          order_items: {
            select: {
              total_price: true,
              quantity: true,
              umrah_package: {
                select: {
                  price: true,
                  name: true,
                  photo_urls: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prismaService.order.count(),
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
}
