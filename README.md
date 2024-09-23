# API Challenge

## Description

This technical interview challenge involves implementing API endpoints for managing schedules and tasks using TypeScript.

Project Architecture: [doc](./project-architecture.md)

Future implementations: [doc](./future-implementations.md)

## Technologies

- **TypeScript**
- **Nestjs**
- **Graphql**
- **PostgresSQL**
- **Prisma**

## How to Run - Server

1. Clone the repository: `git clone https://github.com/dan-ueno/api.git`
2. Ensure Node version from `.nvmrc` is the version that you are using
    - To ensure that is the same, run `$ nvm use`
2. Install dependencies: `npm install`
3. Docker configuration: `docker compose up -d`
4. Define .env file from sample: `cp sample.env .env`
5. Database configuration: 
    - `npm run db:codegen`
    - `npm run db:push`
6. Start the server: `npm start`
7. Access the API at the configured URL.

## How to Run - Tests

1. Ensure Node version from `.nvmrc` is the version that you are using
    - To ensure that is the same, run - `$ nvm use`
2. Install dependencies: `npm install`
3. Define .env file from sample: `cp sample.env .env`, without changing DATABASE_URL
3. Docker configuration: `docker compose up -d`
3. Database configuration: 
    - `npm run db:codegen`
    - `npm run db:push`
4. Run tests scripts: 
    - To run end to end tests: `npm run test:e2e`
    - To run unit/integration tests: `npm run test`
