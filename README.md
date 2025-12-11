# Cakrawala Hub Core API



## Getting started

``` sh
npm ci

# Start Customer Portal API
npm run start:dev -- customer-portal
npm run start:dev -- partner-portal

# Build All App, the library will be embeded in app's code
npm run build -- customer-portal
npm run build -- partner-portal

#Run production mode
export NODE_ENV=production
node dist/apps/customer-portal/main.js
node dist/apps/partner-portal/main.js
```

## Add new App / Library

``` sh
npx nest generate app my-app
npx nest generate library my-library

```

## Troubleshoot

Note: the `cakrawala-hub-library-api` is in separate GIT repo. the repo must exists in the parent directory in the same-level (siblings) with identical folder name. The path is hard-coded in the NestJS project config (`nest-cli.json`) and Typescript config (`tsconfig.json`)

