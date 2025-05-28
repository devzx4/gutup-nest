# nest-server
* Run using Node 20 LTS

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations
* Create a new migration file.
* Note: 'current' DB status (to compare with what modifications are needed) is actually obtained from the actual DB state.
```bash
MG_NAME=shalom yarn run migration:generate
```
* Run migration
```bash
yarn migration:up
```
* Revert migration
```bash
yarn migration:down
```

## Database Connectivity
* When deployed to App Service, enable DB access to all Azure services to giver permission to container to DB
