import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Check if product code already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { productCode: createProductDto.productCode },
    });

    if (existingProduct) {
      throw new ConflictException('Product code already exists');
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        basePrice: createProductDto.basePrice.toString(),
      },
    });
  }

  async findAll(search?: string, activeOnly?: boolean) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { productCode: { contains: search } },
      ];
    }

    if (activeOnly) {
      where.isActive = true;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByProductCode(productCode: string) {
    return this.prisma.product.findUnique({
      where: { productCode },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // Check if product code is being updated and if it conflicts
    if (updateProductDto.productCode) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { productCode: updateProductDto.productCode },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product code already exists');
      }
    }

    const updateData: any = { ...updateProductDto };
    if (updateProductDto.basePrice !== undefined) {
      updateData.basePrice = updateProductDto.basePrice.toString();
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    // Check if product exists
    await this.findOne(id);

    // Check if product is referenced in any orders
    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        'Cannot delete product referenced in existing orders',
      );
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
