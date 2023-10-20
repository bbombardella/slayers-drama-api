import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Product } from '@prisma/client';
import { ProductEntity } from './entities/product.entity';
import Stripe from 'stripe';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  private get productPaginator(): typeof paginator<
    Product,
    Parameters<typeof this.prismaService.product.findMany>[0]
  > {
    return paginator<
      Product,
      Parameters<typeof this.prismaService.product.findMany>[0]
    >;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.prismaService.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productPaginator(
      this.prismaService.product,
      undefined,
      pageable,
    );
  }

  async findOne(id: number): Promise<ProductEntity> {
    return this.prismaService.product.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.prismaService.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number): Promise<ProductEntity> {
    return this.prismaService.product.delete({
      where: { id },
    });
  }

  mapProductToStripe(
    product: ProductEntity,
  ): Stripe.Checkout.SessionCreateParams.LineItem.PriceData {
    return {
      product_data: {
        name: product.name,
      },
      currency: 'EUR',
      unit_amount: product.price * 100,
    };
  }
}
