# ml image processor server

The server application for providing endpoints to handling custom machine learning datasets that a user can create.
It's based on NodeJS, Express and AWS.

## Technology Stack:
- AWS
    - EC2
    - Lambda
    - S3
    - RDS
    - CloudFormation
    - ECR
- Github Actions
- NodeJS
- TypeScript
- Express
- Express-Validator
- Sequelize

## How to run

In order to run the app locally you have to follow these steps:

### Install dependencies

Run this command `npm install`

### Create a database

You need to have some database to play with. You can create one with Docker.

### Customize your connection (Optional)

You can change the db connection inside `src/database/configs/configs.js` under `development` key

### Run server

You can run the server by running `npm run dev`

## Building

In order to build the app, just run following command

`npm run build`

It will create `./dist` folder with your project. Inside this directory will be 2 subdirectories:
- `functions` - AWS Lambda functions
- `src` - the app source

### Running built version

In order to run built project you need to follow these steps

- create `.env` file wth this content

```
PORT=8000
BUCKET={BUCKET_NAME}

PROD_DB_USERNAME={PROD_DB_USERNAME}
PROD_DB_PASSWORD={PROD_DB_PASSWORD}
PROD_DB_NAME={PROD_DB_NAME}
PROD_DB_HOST={PROD_DB_HOST}
PROD_DB_PORT={PROD_DB_PORT}
```
Replace all needed parameters with your production database and S3 bucket.
The db's connection will read those parameters in production env.

- run `npm run prod`

## Testing

The application has 2 test types implemented: unit and integration.

### Unit tests 

To trigger unit tests, run `npm run test:unit`

### Integration tests

To trigger integration tests, run `npm run test:integration` 

Note that you don't need to have your own database since integration testing bases on Docker images, so test db will be created automatically.

### All tests

To trigger both unit and integration tests, run `npm run test:all`

## CI / CD

The pipelines work in Github Actions so that all the workflows are defined under `.github/workflows`
directory.

### Continuous Integration

The CI pipeline is triggered on every push and pull requests. It runs following jobs:
- `format checking` - eslint/prettier checking as well as jscpd validation
- `testing` - runs all the tests including AWS Lambdas' tests
- `build` - builds the app and stores in with the action `actions/upload-artifact`

### Continuous Delivery

The CD pipeline is triggered on every CI finish status. It runs following jobs:
- `cleanup-functions-bucket` - clears all the functions that remain in functions bucket that stores all zipped AWS Lambda functions. This step is only for costs reduction
- `deploy-functions-code` - zips all the AWS Lambdas' codes and uploads them just to functions bucket
- `deploy-cloudformation` - deploys all services defined in `build-template.yml` CloudFormation template, including:
    - `LambdaOnS3UploadTriggerRole` - IAM role that lets a function read S3 bucket
    - `IsUploadedFlagSwitch` - Lambda function that is triggered on S3 upload
    - `LambdaOnS3UploadPermission` - S3 permission to invoke Lambda
    - `MLImagesProcessorImagesBucket` - S3 bucket to store images
- `deploy-app` - the app deploy just to S3 via Docker and AWS ECR. This process has following steps:
    - creates local .env file with DB connection
    - builds local Docker image
    - removes all remained ECR images (for savings purposes)
    - pushing local Docker image to ECR
    - logging to EC2
    - pulling the image from ECR
    - running contenerized application in production environment