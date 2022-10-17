# Crypto Notifier SERVER -- NODE JS

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|PORT           | Port for running app           | 5000      |
|SECRET           | Json web token secret           | cryptoJsonStrong2350k      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) project version 16.15.1


# Getting started
- Clone the repository
```
git clone https://github.com/ashish44khanal/ultimate-trekking-SERVER.git
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:5000`

- API Document endpoints

  Api documentation in a JSON format : https://www.postman.com/collections/e12ddfe103d64554c50b



# TypeScript + Node 
This project was bootstraped using typescript and nodejs. The main purpose of this repository is to webscrape the latest cypto data from <a href='https://coinranking.com/'>Coinranking</a>. Users are also able to signup/login and put their favourite crypto currency to watchlist to get notified whenever their currency hit hightest or lowest.Populer libraries/npm packages used are :
    - express
    - axios
    - cheerio
    - mysql2
    - jsonwebtoken
    - node-cron
    - puppeteer
    - typeorm


## Getting TypeScript
Add Typescript to project `npm`.
```
npm install -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **src/auth**        | Jwt authentication strategy for app
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/commons**              | Common methods to be used across your app.  
| **src/db-config**      | Contain all the database configuration related methods for typeorm. 
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/entities**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/schedulers**      | For all job scheduler methods |
| **src/scrapers**      | For all Data scraping methods |
scheduler methods |
| **src/types**      | Contains type definations for ts |
| **src/validations**      | Contains methods for request validations. |
| **src**/index.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts]   
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
```

### Running the build
All the different build steps are orchestrated via [npm scripts].

| npm scripts | Description |
| ------- | ------------------------------------------------------------------------------------------------- |
| start | Runs full build and runs node on dist/index.js. Can be invoked with `npm start |
| build | Full build. Runs ALL build tasks with all watch tasks |
| dev | Runs application in development mode with nodemon watching the tasks. Can be invoked with `npm dev |                                   

## npm install fails
The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.

