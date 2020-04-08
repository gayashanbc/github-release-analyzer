## Pre-requisites
1. Create an AWS service account to access the Google APIs.
2. Create a Google Sheet and give write access to the service account created above.

## Configurations
### Configure the following environmental variables in serverless.yml.
- SPREADSHEET_ID: Spreadsheet ID of the target Google Sheet.
- SHEET_NAME: Sheet name of the target spread sheet.
- GITHUB_REPO_OWNER: Owner of the target GitHub repository.
- GITHUB_REPO: Target GitHub repository.

### Configure the time interval to run the lambda function
Set the preferred value for the following property in the serverless.yml file. (The interval is not effective when the running function locally.)
- schedule: rate(1 minute).

## How to run locally
1. Clone the repository.
2. Copy the credentials.json file of the Google Service Account to the root of the cloned directory.
3. Configure the environment variables mentioned above.
4. Run npm install command inside the directory.
5. Run npm start command inside the directory.

## How to deploy to AWS
1. Make sure you have configured AWS credentials locally.
2. Run npm run deploy command inside the directory.

## How to remove the deployment from AWS
1. Make sure you have configured AWS credentials locally.
2. Run npm run undeploy command inside the directory.
