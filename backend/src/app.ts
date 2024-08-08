import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import { router } from './routes';
import { port } from './config';

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

async function main() {
  // const allUsers = await prisma.user.findMany();
  // console.dir(allUsers, { depth: null });
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

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
