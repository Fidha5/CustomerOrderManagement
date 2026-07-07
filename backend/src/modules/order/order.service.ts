import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate products and check for duplicates
    const productIds = createOrderDto.items.map(item => item.productId);
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      throw new BadRequestException('Order cannot contain duplicate products');
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: Array.from(uniqueProductIds) } },
    });

    if (products.length !== uniqueProductIds.size) {
      throw new NotFoundException('One or more products not found');
    }

    // Calculate line totals and order totals
    const itemsWithLineTotals = createOrderDto.items.map(item => ({
      ...item,
      lineTotal: item.quantity * item.unitPrice,
    }));

    const subtotal = itemsWithLineTotals.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxAmount = createOrderDto.taxAmount || 0;
    const discountAmount = createOrderDto.discountAmount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: createOrderDto.customerId,
          orderDate: createOrderDto.orderDate || new Date(),
          subtotal: subtotal.toString(),
          taxAmount: taxAmount.toString(),
          discountAmount: discountAmount.toString(),
          totalAmount: totalAmount.toString(),
          notes: createOrderDto.notes,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: itemsWithLineTotals.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          lineTotal: item.lineTotal.toString(),
          notes: item.notes,
        })),
      });

      // Create order history entry
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          changeType: 'CREATED',
          newValue: JSON.stringify({
            orderNumber: newOrder.orderNumber,
            customerId: newOrder.customerId,
            totalAmount: newOrder.totalAmount,
          }),
        },
      });

      return newOrder;
    });

    return this.findOne(order.id);
  }

  async findAll(query: OrderQueryDto) {
    // For SQLite, we need to handle search differently
    if (query.search) {
      // Fetch all orders and filter in memory for case-insensitive search
      const allOrders = await this.prisma.order.findMany({
        where: this.buildWhereClause(query),
        include: {
          customer: true,
          status: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { orderDate: 'desc' },
      });

      const searchTerm = query.search.toLowerCase();
      const filteredOrders = allOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customer?.name.toLowerCase().includes(searchTerm)
      );

      // Apply pagination to filtered results
      const skip = query.page ? (query.page - 1) * (query.limit || 20) : 0;
      const take = query.limit || 20;
      const paginatedOrders = filteredOrders.slice(skip, skip + take);

      return {
        data: paginatedOrders,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 20,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / (query.limit || 20)),
        },
      };
    }

    const where = this.buildWhereClause(query);

    // Pagination
    const skip = query.page ? (query.page - 1) * (query.limit || 20) : 0;
    const take = query.limit || 20;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: true,
          status: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { orderDate: 'desc' },
        skip,
        take,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  private buildWhereClause(query: OrderQueryDto): any {
    const where: any = {};

    // Filter by customer
    if (query.customerId) {
      where.customerId = query.customerId;
    }

    // Filter by status
    if (query.statusId) {
      where.orderStatusId = query.statusId;
    }

    // Filter by date range
    if (query.dateFrom || query.dateTo) {
      where.orderDate = {};
      if (query.dateFrom) {
        where.orderDate.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.orderDate.lte = new Date(query.dateTo);
      }
    }

    return where;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        status: true,
        items: {
          include: {
            product: true,
          },
        },
        history: {
          orderBy: { changedAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        status: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    // Check if order exists
    const existingOrder = await this.findOne(id);

    // Validate customer if being updated
    if (updateOrderDto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: updateOrderDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    // Calculate new totals if items are being updated
    let subtotal = parseFloat(existingOrder.subtotal as any);
    let totalAmount = parseFloat(existingOrder.totalAmount as any);

    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      // Check for duplicate products
      const productIds = updateOrderDto.items.map(item => item.productId);
      const uniqueProductIds = new Set(productIds);

      if (uniqueProductIds.size !== productIds.length) {
        throw new BadRequestException('Order cannot contain duplicate products');
      }

      // Validate products
      const products = await this.prisma.product.findMany({
        where: { id: { in: Array.from(uniqueProductIds) } },
      });

      if (products.length !== uniqueProductIds.size) {
        throw new NotFoundException('One or more products not found');
      }

      // Calculate new line totals and order totals
      const itemsWithLineTotals = updateOrderDto.items.map(item => ({
        ...item,
        lineTotal: item.quantity * item.unitPrice,
      }));

      subtotal = itemsWithLineTotals.reduce((sum, item) => sum + item.lineTotal, 0);
      const taxAmount = updateOrderDto.taxAmount ?? parseFloat(existingOrder.taxAmount as any);
      const discountAmount = updateOrderDto.discountAmount ?? parseFloat(existingOrder.discountAmount as any);
      totalAmount = subtotal + taxAmount - discountAmount;
    } else if (updateOrderDto.taxAmount !== undefined || updateOrderDto.discountAmount !== undefined) {
      const taxAmount = updateOrderDto.taxAmount ?? parseFloat(existingOrder.taxAmount as any);
      const discountAmount = updateOrderDto.discountAmount ?? parseFloat(existingOrder.discountAmount as any);
      totalAmount = subtotal + taxAmount - discountAmount;
    }

    // Update order in a transaction
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Store old value for history
      const oldValue = {
        orderStatusId: existingOrder.orderStatusId,
        totalAmount: existingOrder.totalAmount,
        customerId: existingOrder.customerId,
      };

      // Update order
      const order = await tx.order.update({
        where: { id },
        data: {
          ...(updateOrderDto.customerId && { customerId: updateOrderDto.customerId }),
          ...(updateOrderDto.orderStatusId && { orderStatusId: updateOrderDto.orderStatusId }),
          ...(updateOrderDto.taxAmount !== undefined && { taxAmount: updateOrderDto.taxAmount.toString() }),
          ...(updateOrderDto.discountAmount !== undefined && { discountAmount: updateOrderDto.discountAmount.toString() }),
          ...(updateOrderDto.notes !== undefined && { notes: updateOrderDto.notes }),
          subtotal: subtotal.toString(),
          totalAmount: totalAmount.toString(),
        },
      });

      // Update items if provided
      if (updateOrderDto.items && updateOrderDto.items.length > 0) {
        // Delete existing items
        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });

        // Create new items
        const itemsWithLineTotals = updateOrderDto.items.map(item => ({
          ...item,
          lineTotal: item.quantity * item.unitPrice,
        }));

        await tx.orderItem.createMany({
          data: itemsWithLineTotals.map(item => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            lineTotal: item.lineTotal.toString(),
            notes: item.notes,
          })),
        });
      }

      // Create order history entry
      if (updateOrderDto.orderStatusId && updateOrderDto.orderStatusId !== existingOrder.orderStatusId) {
        await tx.orderHistory.create({
          data: {
            orderId: id,
            changeType: 'STATUS_CHANGED',
            oldValue: JSON.stringify({ statusId: existingOrder.orderStatusId }),
            newValue: JSON.stringify({ statusId: updateOrderDto.orderStatusId }),
          },
        });
      } else {
        await tx.orderHistory.create({
          data: {
            orderId: id,
            changeType: 'UPDATED',
            oldValue: JSON.stringify(oldValue),
            newValue: JSON.stringify({
              orderStatusId: order.orderStatusId,
              totalAmount: order.totalAmount,
              customerId: order.customerId,
            }),
          },
        });
      }

      return order;
    });

    return this.findOne(updatedOrder.id);
  }

  async getStatistics() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayOrders,
      pendingOrders,
      weekOrders,
      monthOrders,
      totalRevenueResult,
      todayRevenueResult,
    ] = await Promise.all([
      // Today's orders
      this.prisma.order.count({
        where: {
          orderDate: { gte: startOfDay },
        },
      }),
      // Pending orders (status ID 2 = PENDING)
      this.prisma.order.count({
        where: { orderStatusId: 2 },
      }),
      // This week's orders
      this.prisma.order.count({
        where: {
          orderDate: { gte: startOfWeek },
        },
      }),
      // This month's orders
      this.prisma.order.count({
        where: {
          orderDate: { gte: startOfMonth },
        },
      }),
      // Total revenue (confirmed orders) - use raw query
      this.prisma.$queryRaw<{ sum: string }[]>`
        SELECT COALESCE(SUM(CAST(total_amount AS REAL)), 0) as sum
        FROM "order"
        WHERE order_status_id = 3
      `,
      // Today's revenue - use raw query
      this.prisma.$queryRaw<{ sum: string }[]>`
        SELECT COALESCE(SUM(CAST(total_amount AS REAL)), 0) as sum
        FROM "order"
        WHERE order_date >= ${startOfDay}
        AND order_status_id = 3
      `,
    ]);

    return {
      todayOrders,
      pendingOrders,
      weekOrders,
      monthOrders,
      totalRevenue: totalRevenueResult[0]?.sum || '0',
      todayRevenue: todayRevenueResult[0]?.sum || '0',
    };
  }

  async remove(id: string) {
    // Check if order exists
    await this.findOne(id);

    // Delete order (will cascade to items and history)
    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}`;

    // Find the highest order number for this year
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
    });

    let sequenceNumber = 1;

    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
      sequenceNumber = lastSequence + 1;
    }

    return `${prefix}-${sequenceNumber.toString().padStart(5, '0')}`;
  }
}