import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create order statuses
  await prisma.orderStatus.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'DRAFT',
      description: 'Order being created',
      isDefault: true,
    },
  });

  await prisma.orderStatus.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'PENDING',
      description: 'Order submitted, awaiting confirmation',
      isDefault: false,
    },
  });

  await prisma.orderStatus.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'CONFIRMED',
      description: 'Order confirmed and active',
      isDefault: false,
    },
  });

  await prisma.orderStatus.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'CANCELLED',
      description: 'Order cancelled',
      isDefault: false,
    },
  });

  console.log('Order statuses created');

  // Create sample customers
  const customers = [
    {
      customerNumber: 'CUST-001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91-98765-43210',
    },
    {
      customerNumber: 'CUST-002',
      name: 'Priya Patel',
      email: 'priya.patel@techcorp.in',
      phone: '+91-98765-43211',
    },
    {
      customerNumber: 'CUST-003',
      name: 'Amit Kumar Enterprises',
      email: 'amit@amitkumar.com',
      phone: '+91-98765-43212',
    },
    {
      customerNumber: 'CUST-004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@gmail.com',
      phone: '+91-98765-43213',
    },
    {
      customerNumber: 'CUST-005',
      name: 'Vikram Singh',
      email: 'vikram.singh@logistics.co.in',
      phone: '+91-98765-43214',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { customerNumber: customer.customerNumber },
      update: {},
      create: customer,
    });
  }

  console.log('Customers created');

  // Create sample products
  const products = [
    {
      productCode: 'PROD-001',
      name: 'Enterprise Software License',
      description: 'Full enterprise software license with unlimited users',
      basePrice: '50000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-002',
      name: 'Cloud Storage - 1TB',
      description: '1TB cloud storage with backup',
      basePrice: '2000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-003',
      name: 'Technical Support Package',
      description: 'Annual technical support package',
      basePrice: '25000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-004',
      name: 'Onboarding Service',
      description: 'Professional onboarding and training',
      basePrice: '15000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-005',
      name: 'API Integration Add-on',
      description: 'API integration services',
      basePrice: '10000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-006',
      name: 'Mobile App License',
      description: 'Mobile application license',
      basePrice: '12000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-007',
      name: 'Analytics Dashboard',
      description: 'Advanced analytics dashboard',
      basePrice: '18000.00',
      isActive: true,
    },
    {
      productCode: 'PROD-008',
      name: 'Security Suite',
      description: 'Enterprise security suite',
      basePrice: '22000.00',
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { productCode: product.productCode },
      update: {},
      create: product,
    });
  }

  console.log('Products created');

  // Create a default admin user
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('Admin user created');

  // Create sample orders
  const customer1 = await prisma.customer.findUnique({
    where: { customerNumber: 'CUST-001' },
  });

  const customer2 = await prisma.customer.findUnique({
    where: { customerNumber: 'CUST-002' },
  });

  if (customer1 && customer2) {
    const product1 = await prisma.product.findUnique({
      where: { productCode: 'PROD-001' },
    });

    const product2 = await prisma.product.findUnique({
      where: { productCode: 'PROD-002' },
    });

    if (product1 && product2) {
      // Create first order
      const order1 = await prisma.order.create({
        data: {
          orderNumber: 'ORD-2026-00001',
          customerId: customer1.id,
          orderStatusId: 3, // CONFIRMED
          orderDate: new Date('2026-07-01'),
          subtotal: '52000.00',
          taxAmount: '0.00',
          discountAmount: '0.00',
          totalAmount: '52000.00',
          notes: 'Annual software license renewal',
        },
      });

      // Add items to first order
      await prisma.orderItem.create({
        data: {
          orderId: order1.id,
          productId: product1.id,
          quantity: 1,
          unitPrice: '50000.00',
          lineTotal: '50000.00',
        },
      });

      await prisma.orderItem.create({
        data: {
          orderId: order1.id,
          productId: product2.id,
          quantity: 1,
          unitPrice: '2000.00',
          lineTotal: '2000.00',
        },
      });

      // Create order history
      await prisma.orderHistory.create({
        data: {
          orderId: order1.id,
          changeType: 'CREATED',
          newValue: JSON.stringify({
            orderNumber: order1.orderNumber,
            totalAmount: order1.totalAmount,
          }),
        },
      });

      // Create second order
      const order2 = await prisma.order.create({
        data: {
          orderNumber: 'ORD-2026-00002',
          customerId: customer2.id,
          orderStatusId: 2, // PENDING
          orderDate: new Date('2026-07-05'),
          subtotal: '25000.00',
          taxAmount: '0.00',
          discountAmount: '0.00',
          totalAmount: '25000.00',
          notes: 'Technical support package for the year',
        },
      });

      const product3 = await prisma.product.findUnique({
        where: { productCode: 'PROD-003' },
      });

      if (product3) {
        await prisma.orderItem.create({
          data: {
            orderId: order2.id,
            productId: product3.id,
            quantity: 1,
            unitPrice: '25000.00',
            lineTotal: '25000.00',
          },
        });
      }

      await prisma.orderHistory.create({
        data: {
          orderId: order2.id,
          changeType: 'CREATED',
          newValue: JSON.stringify({
            orderNumber: order2.orderNumber,
            totalAmount: order2.totalAmount,
          }),
        },
      });

      console.log('Sample orders created');
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });