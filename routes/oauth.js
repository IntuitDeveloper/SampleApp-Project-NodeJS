const OAuthClient = require('intuit-oauth');
const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();

const {setClient, getClient} = require('../services/auth-service');

const router = express.Router();

let oauthClient = null;
let token = null;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/login', urlencodedParser, function (req, res) {
  oauthClient = new OAuthClient({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      environment: process.env.ENVIRONMENT,
      redirectUri: process.env.REDIRECT_URI,
      logging: true,
  });

  const project = 'project-management.project';
  const authUri = oauthClient.authorizeUri({
    scope: [
      OAuthClient.scopes.Accounting,
      OAuthClient.scopes.Payment,
      OAuthClient.scopes.OpenId,
      OAuthClient.scopes.Profile,
      OAuthClient.scopes.Email,
      project
    ],
  });
  req.oauthClient = oauthClient;
  res.json({redirectUrl: authUri});
});

router.get('/callback', async function (req, res) {
  const authResponse = await oauthClient.createToken(req.url);
  setClient(oauthClient);
  token = authResponse.json.access_token;
  res.redirect('/');
});

router.post('/retrieveToken', function (req, res) {
    res.json({token: (getClient()?.getToken()?.getToken())});
});

module.exports = router;