# Stealth Startup (E - Commerce Backend System)

This backend application is intended to complete the tasks given by Stealth Startup to continue the hiring process.

# Sytem Design

- The application uses an Presenter to bind all services along a single front, acting as a proxy for the domains in which the `auth`, `checkout`, `cart`, and `product` services are deployed on
- The `auth` service has main functionality for User Login and Register.
- The `products` service has main functionality for Create, Read, Update and Delete (CRUD)
- The `cartss` service intended to manipulate the user cart, like add product, remove product and modify the product quantity.
- The `checkouts` service intended to checkout and update the user order to be paid and update the quantity of the product on the database

## System Architecture

<img alt="image" src="https://user-images.githubusercontent.com/69677864/223522265-3a585a38-0148-4921-bfea-fd19989c8bff.png">

- The architecture for a microservice is inspired by the [Clean Architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2), which supports strong modularity, loose coupling, and dependency injection

Tech Stack: Node.js, Express, Typescript, Prisma, Jest, and PostgreSQL

## Prerequisites

- Have [npm](https://www.npmjs.com) and [Node.js](https://nodejs.dev/en/) on your machine
- Have PostgreSQL installed. [postgresql]()
- Have pnpm installed [pnpm](https://pnpm.io/installation) on your machine.

## Steps to run

### On localhost

1.  Create a .env file following the format specified in the root folder `/.env`
2.  Setting up all the required environment variable :

```
NODE_ENV=development
APP_PORT=5000
JWT_SECRET=
JWT_EXPIRATION=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRATION=
DATABASE_URL=postgresql://DBUSER:DBPASSOWRD@DBHOST:DBPORT/DBNAME?schema=DBSCHEMA
```

3.  Run `pnpm install`
4.  Run the migration `npx prisma db migrate dev`
5.  Run the database seeder `ts-node ./prisma/seeders/users.seeder.ts`
6.  Run `pnpm run start:dev` Now you can test the APIs from localhost:5000

## API Documentations

The API Documentations can be accessed through this [Postman Documentation](https://documenter.getpostman.com/view/24159172/2s9YeG6rHR)

## Future work and improvements

- It could be useful to use docker for containerization in order to bundle up the project into one ecosystem.
- While I tried to follow a TDD approach - that is, letting test cases guide development - I eventually gave up on it in the name of speedy development. Ideally, I could have written unit tests first, and slowly increment up to integration tests and then system tests.
- It could be a good exercise to deploy the databases across different platforms (e.g. Firebase, SQL, etc.) to prevent a single point of failure or include the database in the docker ecosystem using docker compose.
