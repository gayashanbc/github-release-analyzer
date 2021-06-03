const process = require('process');
const { google } = require('googleapis');
const privateKey = require("./credentials.json");
const request = require('request');

async function authorize() {
  let jwtClient = new google.auth.JWT(
    privateKey.client_email,
    null,
    privateKey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  return new Promise((resolve, reject) => {
    jwtClient.authorize(function (error, tokens) {
      if (error) {
        reject(error);
      } else {
        console.log("Google Sheets API Authentication successful");
        resolve(jwtClient);
      }
    });
  });
}

async function getReleaseDetails() {
  const url = `https://api.github.com/repos/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO}/releases/latest`;

  const options = {
    json: true, headers: {
      'User-Agent': process.env.GITHUB_REPO_OWNER
    }
  };

  return new Promise((resolve, reject) => {
    request(url, options, (error, response, json) => {
      if (error) {
        reject(error);
      };

      if (!error && response.statusCode === 200) {
        console.log('Release Data: ', json);
        resolve(json);
      };
    });
  });
}

function processData(rawData) {
  const keys = ['tag_name'];
  const date = new Date();
  const values = [`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`];

  keys.forEach(key => values.push(rawData[key]));

  rawData.assets
    .filter(asset => asset.name.endsWith('.zip'))
    .forEach(asset => values.push(asset.download_count));

    return values;
}

async function appendToGoogleSheet(authClient, data) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const response = (await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.SHEET_NAME,
    valueInputOption: 'RAW',
    insertDataOption: 'OVERWRITE',
    includeValuesInResponse: true,
    prettyPrint: true,
    resource: {
      values: [
        data
      ],
    },
  })).data;

  console.log('Google API Append Response', JSON.stringify(response, null, 4));
}

module.exports.analyse = async event => {
  console.log('Release analyzer triggered.')

  try {
    const releaseData = await getReleaseDetails();
    const authClient = await authorize();

    delete releaseData.body;

    await appendToGoogleSheet(authClient, processData(releaseData));
  } catch (error) {
    console.error('Error occurred while running the handler: ', error);
  }

  console.log('Release analyzer ended.');
};

module.exports.writeRawData = async event => {
  console.log('Release analyzer triggered.')

  try {
    const releaseData = await getReleaseDetails();
    const authClient = await authorize();

    delete releaseData.body;

    await appendToGoogleSheet(authClient, [JSON.stringify(releaseData)]);
  } catch (error) {
    console.error('Error occurred while running the handler: ', error);
  }

  console.log('Release analyzer ended.');
};
