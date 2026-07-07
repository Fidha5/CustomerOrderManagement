import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if customer number already exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { customerNumber: createCustomerDto.customerNumber },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer number already exists');
    }

    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(search?: string) {
    if (search) {
      // For SQLite, fetch all and filter in memory for case-insensitive search
      const customers = await this.prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const searchTerm = search.toLowerCase();
      return customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.customerNumber.toLowerCase().includes(searchTerm)
      );
    }

    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByCustomerNumber(customerNumber: string) {
    return this.prisma.customer.findUnique({
      where: { customerNumber },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    // Check if customer exists
    await this.findOne(id);

    // Check if customer number is being updated and if it conflicts
    if (updateCustomerDto.customerNumber) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { customerNumber: updateCustomerDto.customerNumber },
      });

      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException('Customer number already exists');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    // Check if customer exists
    await this.findOne(id);

    // Check if customer has orders
    const ordersCount = await this.prisma.order.count({
      where: { customerId: id },
    });

    if (ordersCount > 0) {
      throw new ConflictException('Cannot delete customer with existing orders');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}