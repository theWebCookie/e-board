import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';

export interface appConfig {
  port: number;
}

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

async function main() {
  const allUsers = await prisma.user.findMany();
  console.dir(allUsers, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
