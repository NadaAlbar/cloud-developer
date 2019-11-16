// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3bueizpypj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-q08g59q7.auth0.com',            // Auth0 domain
  clientId: '0JUiAHdO6K3EEAX2mEPhDxIdwvgQQbMP',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

