# nest-server
* Run using Node 20 LTS

## Setup
* The APNS module and Apple AUTH requires the `APPLE_SIGNING_KEY`. So if Apple integration is not something that will be used, remove the modules.

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

## Authentication, Guards, and Protected endpoints
* By default, due to the global `APP_GUARD` provider at __app.module.ts__, all endpoints are protected.
  + https://docs.nestjs.com/recipes/passport#enable-authentication-globally
* To make specific endpoints public, use the `@Public()` decorator
* Gating is enabled globally. Therefore nothing in special should be included when defining endpoints on the controller except for `@DefaultAuth()` decorator
  + This decorator is actually needed only for Swagger to instruct Swagger that this is a gated endpoint so bearer token should be sent

## Strapi Integration
* In __config/feature.config.ts__, you can enable Strapi-related features
* Create a Strapi API token with the permissions
  + Server-auth -> auth (This is a custom plugin)
  + Users-permissions -> User -> [find, findOne, create, update]
* Fill the Strapi related variables in __.env.sample__
