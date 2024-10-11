import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.user
      .findMany({
        where: {
          role: UserRole.MEMBER,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          orders: {
            select: {
              total_price: true,
              order_items: {
                select: {
                  umrah_package: {
                    select: {
                      id: true,
                      ustadz_id: true,
                      grade_id: true,
                      name: true,
                      description: true,
                      price: true,
                      photo_urls: true,
                      video_urls: true,
                      created_at: true,
                      updated_at: true,
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
          },
        },
      })
      .then((users) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role as UserRole,
          order_frequency: user.orders.length,
          total_order_value: user.orders.reduce(
            (sum, order) => sum + order.total_price,
            0,
          ),
          ordered_items: Array.from(
            new Set(
              user.orders.flatMap((order) =>
                order.order_items.map((item) => ({
                  ...item.umrah_package,
                  photo_urls: item.umrah_package.photo_urls,
                  video_urls: item.umrah_package.video_urls,
                  created_at: item.umrah_package.created_at.toISOString(),
                  updated_at: item.umrah_package.updated_at.toISOString(),
                })),
              ),
            ),
          ),
        })),
      );
  }
}
