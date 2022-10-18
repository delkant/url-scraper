
## PRE-REQUISITS
- Docker
- NPM

## DOCKER
Before running the application make sure that you are running Redis and Postgres.
###### Postgres: 
```
docker run --name vizion-db -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vizion -d postgres
```
###### Redis: 
```
docker run --name vizion-redis -p 6379:6379 -d redis
```
## NPM
- Installing the app dependencies.
Change dir to `api-challenge`(this repo) and run `npm install`
- Running the App
Run `npm run start`

## TESTS
 Tests can be improved a lot, unfortunately is what I have to sacrifice this time due my lack of time
  - Unit tests: `npm run test` implementation [here](https://github.com/delkant/url-scraper/blob/main/src/reference/controllers/reference.controller.spec.ts)
  - e2e tests: `npm run test:e2e` implementation [here](https://github.com/delkant/url-scraper/blob/main/test/app.e2e-spec.ts)


## OpenAPI Specification (OAS)
After the app is running you can interacting with the API here: [The API Docs](http://localhost:3000/api-docs)


## About the implementation:
This app was implemented with:
 - [NestJS](https://nestjs.com/)
 - Typescript
 - TypeORM and PostgreSQL
 - Redis
 - Bull (Redis-based queue for Node.)
 - Puppeteer 

 ## Author
 Rodrigo Del Canto