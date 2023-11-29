import { Prisma, PrismaClient, Products, Users } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUserPassword(): Promise<string> {
  const hashRound: number = 10;
  return await bcrypt.hash('password', hashRound);
}

async function generateFakeUser(): Promise<Prisma.UsersCreateInput> {
  const user: Prisma.UsersCreateInput = {
    username: faker.internet.userName(),
    password: await createUserPassword(),
    lastLogin: new Date(),
    hashRefreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return user;
}

async function generateFakeProduct(): Promise<Prisma.ProductsCreateInput> {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1000, max: 200000 }),
    quantity: parseInt(faker.random.numeric(3)),
  } as Prisma.ProductsCreateInput;
}

async function main() {
  return await prisma.$transaction(async (tx) => {
    const users: Users[] = [];
    const products: Products[] = [];

    for (let i = 0; i < 20; i++) {
      let userData: Prisma.UsersCreateInput;
      const productData = await generateFakeProduct();

      if (i === 0) {
        userData = {
          username: 'bale',
          password: await createUserPassword(),
          lastLogin: new Date(),
          hashRefreshToken: null,
          roles: ['admin'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        userData = await generateFakeUser();
      }

      const user = await tx.users.create({ data: userData });
      const product = await tx.products.create({
        data: productData,
      });

      users.push(user);
      products.push(product);
    }
    console.log(users);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
