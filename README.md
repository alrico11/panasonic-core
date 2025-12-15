# Cakrawala Hub Core API



## Getting started

### Generate JWT's Keys

``` sh
# Generate private & public key or use default
openssl ecparam -name prime256v1 -genkey -noout -out key_private.pem
openssl ec -in key_private.pem -pubout -out key_public.pem

```

### Setup Development

Copy and modify `.env.example` to `.env`


``` sh
# Install NPM Dependencies
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

## Create Migrations

``` sh
npm run migrate:make -- create-table-user
```


## Troubleshoot

Note: the `cakrawala-hub-library-api` is in separate GIT repo. the repo must exists in the parent directory in the same-level (siblings) with identical folder name. The path is hard-coded in the NestJS project config (`nest-cli.json`) and Typescript config (`tsconfig.json`)

## Branching Strategy

Name       |Description                                                         |Format                              |Note                                                         
-----------|--------------------------------------------------------------------|------------------------------------|-------------------------------------------------------------
production |Branch untuk production                                             |                                    |                                                             
stage      |Branch untuk testing di staging                                     |                                    |                                                             
main       |Branch pengembangan utama. Semua fitur masuk ke sini sebelum release|                                    |                                                             
feature/\* |Untuk pengembangan fitur baru                                       |feature/<module>-<short-description>|eg: feature/auth-login-page, feature/customer-api-integration
bugfix/\*  |Untuk perbaikan bug di environment development                      |bugfix/<module>-<short-description> |eg: bugfix/user-profile-date-error                           
refactor/\*|                                                                    |                                    |                                                             
hotfix/\*  |Perbaikan kritis untuk production                                   |hotfix/<issue>-<short-description>  |eg: hotfix/payment-timeout                                   
release/\* |Persiapan rilis versi tertentu                                      |release/v<version>                  |eg: release/v1.2.0                                           



## Commit Message		
Supaya mudah di track dan konsisten commit message jangan repeatitive atau kosong 		

**Format:**
```
<type>(<scope>): <short summary>
[optional body]
[optional footer]
```

**Contoh:**
```
feat(warranty): implement warranty claim validation

- Add new validation pipeline
- Add new DTO for claim rules
- Sync with partner-portal-api data format

```	
**Type**
|Type    |Kegunaan                                             |                                                                |
|--------|-----------------------------------------------------|----------------------------------------------------------------|
|feat    |Penambahan fitur baru                                |feat(auth): add login API with JWT cookie strategy              |
|fix     |Perbaikan bug                                        |fix(order): resolve duplicate transaction issue in checkout flow|
|docs    |Perubahan dokumentasi                                |docs(readme): update project setup instruction                  |
|style   |Perubahan minor (formatting, spacing, no code change)|                                                                |
|refactor|Perubahan kode non-fungsional                        |refactor(user): simplify profile query using relation mapping   |
|perf    |Peningkatan performa                                 |                                                                |
|test    |Penambahan/perubahan test                            |                                                                |
|chore   |Perubahan konfigurasi, CI/CD, dependencies, dll      |                                                                |