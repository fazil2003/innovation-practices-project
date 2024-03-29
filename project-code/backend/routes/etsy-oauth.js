const router = require('express').Router();
const path = require('path');
const db = require('./models/connect-db');

var defaultVariables = require('./variables/variables');

var usersModel = require('./models/user-model');
var shopsModel = require('./models/shop-model');
const receiptsModel = require('./models/receipt-model');

router.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '../views/etsy-auth.html'));
});

router.route('/login').get((req, res) => {
    res.sendFile(path.join(__dirname, '../views/user-login.html'));
});

router.route('/login-validate').post((req, res) => {
    res.redirect(307, '/mongodb/register');
});

router.route('/require-access').get((req, res)=>{
    res.sendFile(path.join(__dirname, '../views/etsy-auth.html'));
});

router.route('/home').get((req, res)=>{
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

// Etsy API
const etsyAPIKey = 'p8eqqvkph27mp9hrxebyx3re';
const shared_secret = 'opmb58lswy';

// Request 1 - Request an Authorization Code.
const responseType = 'code';
const redirectUri = 'https://etsy.aloask.app';
const scope = 'transactions_r%20listings_r';
// const clientID = etsyAPIKey;
const state = 'superstate';
const codeChallenge = 'DSWlW2Abh-cf8CeLL8-g3hQ2WQyYdKyiu83u_s7nRhI';
const codeChallengeMethod = 'S256';

router.route('/request-code').get((req, res)=>{

    // var userEmail = req.cookies.email
    // var userEmail = req.query.email;
    // res.cookie('email', userEmail, { maxAge: 900000, httpOnly: true });

    var currentShopID = req.query.current_shop_id;
    res.cookie('current_shop_id', currentShopID, { maxAge: 900000, httpOnly: true });

    shopsModel.find({$or:[{ 'shop_id': currentShopID }]}, (err, docs) => {
        if (!err) {
            // console.log(docs[0]['email']);
            var apiKey = docs[0]['api_key'];
            res.cookie('api_key', apiKey, { maxAge: 900000, httpOnly: true });

            res.redirect(
                'https://www.etsy.com/oauth/connect?' +
                'response_type=' + responseType +
                '&redirect_uri=' + redirectUri +
                '&scope=' + scope +
                '&client_id=' + apiKey +
                '&state=' + state +
                '&code_challenge=' + codeChallenge +
                '&code_challenge_method=' + codeChallengeMethod
            );

        } else {
            res.send("Failed to Authenticate.");
        }
    });    

});


// Request 2 - Request an Access Token.
const clientVerifier = 'vvkdljkejllufrvbhgeiegrnvufrhvrffnkvcknjvfid';
router.route('/request-token').get(async (req, res)=>{
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: req.cookies.api_key,
            redirect_uri: redirectUri,
            code: authCode,
            code_verifier: clientVerifier,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(tokenUrl, requestOptions);

    // Extract the access token from the response access_token data field
    if (response.ok) {
        const tokenData = await response.json();
        // res.send(tokenData);
        // const jsonObj = JSON.parse(tokenData);

        // let urlToLoad = "/retrieve-data?access_token=" + tokenData['access_token'];
        // res.redirect(urlToLoad);

        var myQuery = { shop_id: parseInt(req.cookies.current_shop_id) };
        var newvalues = { $set: {
            etsy_authorized: true,
            access_token: tokenData['access_token'],
            refresh_token: tokenData['refresh_token'],
            time_limit: tokenData['expires_in'],
            last_synched: new Date()
        } };
        db.collection("shops").updateOne(myQuery, newvalues, function(err, resDB) {
            if (err) throw err;
            res.redirect(defaultVariables['frontend-url'] + "home");
        });

    } else {
        res.send("Failed to get the data.");
    }
});

// Request 3 - Retrieve the Contents.
router.route('/retrieve-data').get(async (req, res)=>{
    // We passed the access token in via the querystring
    // const { access_token } = req.query;

    // var userEmail = req.cookies.email
    // var userEmail = req.query.email;
    var shopID = req.query.shop_id;

    shopsModel.find({$or:[{ 'shop_id': shopID }]}, async (err, docs) => {
        if (!err) {
            var access_token = docs[0]['access_token'];
            var apiKey = docs[0]['api_key'];
            // An Etsy access token includes your shop/user ID
            // as a token prefix, so we can extract that too
            const user_id = access_token.split('.')[0];

            const requestOptions = {
                headers: {
                    'x-api-key': apiKey,
                    // Scoped endpoints require a bearer token
                    Authorization: `Bearer ${access_token}`,
                }
            };

            const response = await fetch(
                'https://api.etsy.com/v3/application/shops/' + shopID + '/listings?state=draft',
                requestOptions
            );

            if (response.ok) {
                const listData = await response.json();
                // // Load the template with the first name as a template variable.
                // res.render("welcome", {
                //     first_name: userData.first_name
                // });
                res.send(listData['results']);
            } else {
                res.send("oops");
            }
            
        } else {
            res.send("Failed to Authenticate.");
        }
    });    

});

// Request 4 - Generate new access token from the refresh token.
router.route('/get-token').get(async (req, res)=>{
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    // const refreshToken = '417870418.eBihuefnLSDSAfzxvUZu5VKulKwg2daMlym0ixwrxxxPkJ9dK-AYpGoCMMEjlimEcnTrKAAKK0RqklNWfXp-Z53JVX';
    const refreshToken = req.query.refresh_token;
    const api_key = req.query.api_key;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: api_key,
            refresh_token: refreshToken,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(tokenUrl, requestOptions);

    // Extract the access token from the response access_token data field
    if (response.ok) {
        const tokenData = await response.json();

        // const obj = JSON.parse(tokenData);
        // Get the data from the JSON.
        console.log(tokenData['access_token']);

        res.send(tokenData);
    } else {
        res.send("Failed to get the data.");
    }
});

// Request 5 - Get the details of the shop.
const shopName = "HappyByVimalYet";
router.route('/get-shop-details').post(async (req, res) => {

    const shopName = req.body.shop_name;
    var apiKey = req.body.api_key;

    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
        }
    };

    const response = await fetch(
        "https://api.etsy.com/v3/application/shops?shop_name="+ shopName +"&api_key=" + apiKey,
        requestOptions
    );

    if (response.ok) {
        const listData = await response.json();
        if(listData['count'] > 0){
            let shopID = (listData['results'][0]['shop_id'].toString());
            console.log(listData);
            res.send(shopID);
        }
        else{
            res.send("0");
        }
        // res.redirect('/retrieve-data?shop=' + shopID)
        // res.send('success');
    } else {
        res.send("0");
    }

});


// Request to Retrieve the receipts.
router.route('/retrieve-receipts').get(async (req, res) => {

    var shopID = req.query.shop_id;

    shopsModel.find({$or:[{ 'shop_id': parseInt(shopID) }]}, async (err, docs) => {
        if (!err) {
            var access_token = docs[0]['access_token'];
            var apiKey = docs[0]['api_key'];
            var lastEpochTime = docs[0]['last_epoch_time'];
            const user_id = access_token.split('.')[0];
            const requestOptions = {
                headers: {
                    'x-api-key': apiKey,
                    // Scoped endpoints require a bearer token
                    Authorization: `Bearer ${access_token}`,
                }
            };

            const response = await fetch(
                'https://api.etsy.com/v3/application/shops/' + shopID + '/receipts',
                requestOptions
            );

            if (response.ok) {

                const listData = await response.json();

                listData["results"].forEach(async function(receiptData) {
                    
                    try{
                        if (receiptData["created_timestamp"] > lastEpochTime){
                            receiptData["isProcessed"] = true;
                            receiptData["shop_id"] = parseInt(shopID);
                            // const insertData = await receiptsModel.create(receiptData);
                            new receiptsModel(receiptData).save();
                        }
                    
                    }
                    catch (error) {}

                });

                var myQuery = { shop_id: parseInt(shopID) };
                var newValues = { $set:
                    {
                        last_epoch_time: Math.round(new Date().getTime()/1000)
                    }
                };

                db.collection("shops").updateOne(myQuery, newValues, function(err, resMongo) {
                    if (err) throw err;
                });

                // res.send(listData['results']);
                res.send("Data retrieved successfully.");

            }
            else {
                res.send("Failed to retrieve the data.");
            }
            
        } else {
            res.send("Failed to Authenticate.");
        }
    });    

});

module.exports = router;