require("dotenv").config();

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const rawData = require("./seed-data.json");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding...");

  const data = rawData;
  const customers = data.customers || [];
  const invoices = data.invoices || [];
  const payments = data.payments || [];

  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    });
  }

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: invoice,
    });
  }

  for (const payment of payments) {
    await prisma.payment.create({
      data: payment,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });