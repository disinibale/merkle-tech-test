# Merkle Technical Test

This backend application is intended to complete the tasks given by Merkle Innovation to continue the hiring process.

## API Endpoint

This Backend System has several API Endpoint that can be accessed through this enpoints below :

- `[POST] auth/login` This endpoint is used for Authenticating the user
- `[POST] auth/login` This endpoint is used for Registering the user
- `[GET] wedding-books/:id` This endpoint is get the weeding book by id for admin
- `[GET] wedding-books` This endpoint is get all the weeding book data for admin
- `[POST] wedding-books` This endpoint is create the weeding book data for admin and guest
- `[PUT] wedding-books/:id` This endpoint is edit the weeding book data by id for admin
- `[DELETE] wedding-books/:id` This endpoint is delete the weeding book data by id for admin
- `[GET] wedding-books/note-gallery` This endpoint is intended to show all the wedding book data for user and has only two properties (name & note)
- `[GET] wedding-books/soal1` This endpoint intended to answer the question no 1

## System User
The user for admin can be filled by this username and password in the `auth/login` endpoint:
```json
{
    "username": "bale",
    "password": "password"
}
```
And for the guest, the user can be registered through `auth/register`

## System Architecture

<img alt="image" src="https://user-images.githubusercontent.com/69677864/223522265-3a585a38-0148-4921-bfea-fd19989c8bff.png">

- The architecture for a microservice is inspired by the [Clean Architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2), which supports strong modularity, loose coupling, and dependency injection

Tech Stack: Node.js, NestJs, Typescript, Prisma, Jest, and PostgreSQL

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

The API Documentations can be accessed through this [Postman Documentation](https://documenter.getpostman.com/view/24159172/2s9YeG7rjC)

## Future work and improvements

- It could be useful to use docker for containerization in order to bundle up the project into one ecosystem.
- While I tried to follow a TDD approach - that is, letting test cases guide development - I eventually gave up on it in the name of speedy development. Ideally, I could have written unit tests first, and slowly increment up to integration tests and then system tests.
- It could be a good exercise to deploy the databases across different platforms (e.g. Firebase, SQL, etc.) to prevent a single point of failure or include the database in the docker ecosystem using docker compose.
