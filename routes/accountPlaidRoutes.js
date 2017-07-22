//
//Required components
//
const passport = require('passport');
const express = require('express');
const routeforPlaid = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const plaid = require('plaid');
var envvar = require('envvar');



var APP_PORT = envvar.number('APP_PORT', 8000);
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID',"595154f64e95b81c69ae98b9");
var PLAID_SECRET = envvar.string('PLAID_SECRET',"7cce0a621ea2e694f996d49289c356");
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY',"f304c07f2fa4a2844443e8b4b1afbe");
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

// Initialize the Plaid client
var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

//
//Home controller
//
routeforPlaid.get('/accountPlaid', (req, res, next) => {
  // res.render('accountPlaid/home',{
  //   PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
  //   PLAID_ENV: PLAID_ENV,
  // });
  {res.status(200).json({
    PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
    PLAID_ENV: PLAID_ENV,
  })}
 
});

//
// Get access token
//
routeforPlaid.post('/accountPlaid/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.publicToken;
  console.log('PUblic', PUBLIC_TOKEN);
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      var msg = 'Could not exchange public_token!';
      console.log(msg + '\n' + error);
      return response.json({
        error: msg
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);
    response.json({
      'error': false
    });
  });
});


routeforPlaid.post('/accountPlaid/accounts/get', function(request, response, next) {

  client.getAccounts(ACCESS_TOKEN, (error, result) => {
    // Handle err
    // Each account has up-to-date balance information associated with it
      if (error != null) {
        var msg = 'Unable to pull accounts from the Plaid API.';
        console.log(msg + '\n' + error);
        return response.json({
          error: msg
        });
      }

      var filteredAccounts = result.accounts.filter((value)=>{
          return value.subtype=="checking";
      })

      response.json({
        error: false,
        results: filteredAccounts,
      });
    });
    return
});


module.exports = routeforPlaid;