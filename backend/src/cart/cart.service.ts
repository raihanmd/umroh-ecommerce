import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ValidationService } from "src/common/validation/validation.service";
import { CartValidation } from "./zod";
import { CartItemEntity } from "./entity";
import { User } from "@prisma/client";
import { CreateCartItemDto, DeleteCartDto, UpdateCartItemDto } from "./dto";
import { CartItemResponse } from "./response";

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async create(data: CreateCartItemDto, user: User): Promise<CartItemEntity> {
    const validatedData = this.validationService.validate(
      CartValidation.CREATE,
      { ...data, user_id: user.id },
    );

    const umrahPackage = await this.prismaService.umrahPackage.findUnique({
      where: { id: validatedData.umrah_package_id },
    });

    if (!umrahPackage) throw new NotFoundException("Package not found");

    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: {
        umrah_package_id: validatedData.umrah_package_id,
        user_id: user.id,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + validatedData.quantity;
      const updatedTotalPrice = newQuantity * umrahPackage.price;

      const updatedCartItem = await this.prismaService.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          total_price: updatedTotalPrice,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedCartItem;
    } else {
      const total_price = validatedData.quantity * umrahPackage.price;

      const cartItem = await this.prismaService.cartItem.create({
        data: {
          ...validatedData,
          total_price,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return cartItem;
    }
  }

  async update(data: UpdateCartItemDto, user: User): Promise<CartItemEntity> {
    const validatedData = this.validationService.validate(
      CartValidation.UPDATE,
      { ...data, user_id: user.id },
    );

    const cartItem = await this.prismaService.cartItem.findFirst({
      where: {
        umrah_package_id: validatedData.umrah_package_id,
        user_id: user.id,
      },
      include: { umrah_package: true },
    });

    if (!cartItem) throw new NotFoundException("Cart item not found");

    const updatedTotalPrice =
      validatedData.quantity * cartItem.umrah_package.price;

    const updatedCartItem = await this.prismaService.cartItem.update({
      where: {
        id: cartItem.id,
        user_id: user.id,
        umrah_package_id: validatedData.umrah_package_id,
      },
      data: {
        ...validatedData,
        total_price: updatedTotalPrice,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedCartItem;
  }

  async get(user_id: string): Promise<CartItemResponse[]> {
    return await this.prismaService.cartItem.findMany({
      where: { user_id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        umrah_package: {
          select: {
            id: true,
            name: true,
            price: true,
            photo_urls: true,
            description: true,
          },
        },
      },
    });
  }

  async delete(data: DeleteCartDto, user: User): Promise<string> {
    this.validationService.validate(CartValidation.DELETE, data);

    const cartItem = await this.prismaService.cartItem.deleteMany({
      where: {
        umrah_package_id: data.umrah_package_id,
        user_id: user.id,
      },
    });

    if (cartItem.count === 0)
      throw new NotFoundException("Cart item not found");

    return "Success";
  }

  async getAll(): Promise<CartItemEntity[]> {
    return await this.prismaService.cartItem.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        umrah_package: {
          select: {
            id: true,
            name: true,
            price: true,
            photo_urls: true,
            description: true,
          },
        },
      },
    });
  }
}
