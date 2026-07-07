/**
 * Database Verification Script
 * Run with: npx ts-node scripts/verify-db.ts
 */

import { PrismaClient } from '@prisma/client';

async function verifyDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verifying database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Get database type using raw query
    const result = await prisma.$queryRaw`SELECT current_database();`;
    console.log('📊 Database Info:', result);

    // Get PostgreSQL version
    const version = await prisma.$queryRaw`SELECT version();`;
    console.log('📌 Version:', (version as any)[0]?.version?.split(',').shift());

    // List tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('\n📋 Tables:', tables.map((t: any) => t.table_name).join(', '));

    // Get row counts
    console.log('\n📈 Row Counts:');
    const [users, customers, products, orders] = await Promise.all([
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "user"`,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM customer`,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM product`,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "order"`,
    ]);

    console.log('  - Users:', (users as any)[0]?.count || 0);
    console.log('  - Customers:', (customers as any)[0]?.count || 0);
    console.log('  - Products:', (products as any)[0]?.count || 0);
    console.log('  - Orders:', (orders as any)[0]?.count || 0);

    console.log('\n✅ Verification complete - Using PostgreSQL!');

  } catch (error: any) {
    console.error('❌ Database verification failed:', error.message);

    // Check if it's a PostgreSQL error
    if (error.message.includes('sqlite')) {
      console.log('⚠️  Still using SQLite!');
    } else if (error.message.includes('postgres')) {
      console.log('✅ Connected to PostgreSQL (but query failed)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
