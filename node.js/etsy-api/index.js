var express = require('express');
var app = express();

var bcrypt = require('bcrypt');

const path = require('path');

const keystring = 'p8eqqvkph27mp9hrxebyx3re';
const shared_secret = 'opmb58lswy';

// LINKS
// Etsy Your Apps Link: https://www.etsy.com/developers/your-apps
// OLD URL: https://horal-extensions.000webhostapp.com

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');


// Test Requests.
app.get('/', function(req, res){
   res.send("Hello world!");
});

app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/help', function(req, res) {
    var q = req.query.code;
    var p = req.query.code;
    res.render('get', {'q': q, 'p': p});
});

app.get('/get', function(req, res){
    var q = req.query.q;
    var p = req.query.p;
    res.render('get', {'q': q, 'p': p});
});


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

// Get the data from mongodb.
app.get('/mongodb/get', function(req, res){
    
    MongoClient.connect(url, { useNewUrlParser: true })
    .then((client) => {
        const db = client.db('etsy-api');
        const collection = db.collection('users');
        return collection.find({}).toArray();
    })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));

    res.send("Hello world!");
});


async function hashPassword(plainText) {
    try {
        const hashedPassword = await bcrypt.hash(plainText, 12);
        return hashPassword;
    } catch (err) {
        console.log(err);
        return "null";
    }
}


function comparePassword(plaintextPassword, hash) {
    bcyrpt.compare(plaintextPassword, hash)
    .then(result => {return result})
    .catch(err => {console.log(err)})
}

// Insert the data into the mongodb.
app.get('/mongodb/insert', async function(req, res){

    var password = "PassJohnDoe";
    var encryptedPassword = await bcrypt.hash(password, 20);

    var myobj = {
        fullname: "John Doe",
        username: "johndoe",
        email: "johndoe@email.com",
        password: encryptedPassword
    };

    MongoClient.connect(url, { useNewUrlParser: true })
    .then((client) => {
        const db = client.db('etsy-api');
        const collection = db.collection('users');
        return collection.insertOne(myobj)
    })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));

    res.send("Hello world!");

});


// Request 1 - Request an Authorization Code.
const responseType = 'code';
const redirectUri = 'https://etsy.aloask.app';
const scope = 'transactions_r%20listings_r';
const clientID = keystring;
const state = 'superstate';
const codeChallenge = 'DSWlW2Abh-cf8CeLL8-g3hQ2WQyYdKyiu83u_s7nRhI';
const codeChallengeMethod = 'S256';

app.get('/request-code', function(req, res){
    // res.redirect('https://etsy.aloask.app');
    res.redirect(
        'https://www.etsy.com/oauth/connect?' +
        'response_type=' + responseType +
        '&redirect_uri=' + redirectUri +
        '&scope=' + scope +
        '&client_id=' + clientID +
        '&state=' + state +
        '&code_challenge=' + codeChallenge +
        '&code_challenge_method=' + codeChallengeMethod
        );
});


// Request 2 - Request an Access Token.
const clientVerifier = 'vvkdljkejllufrvbhgeiegrnvufrhvrffnkvcknjvfid';

app.get("/request-token", async (req, res) => {
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientID,
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
        let urlToLoad = "/retrieve-data?access_token=" + tokenData['access_token'];
        res.redirect(urlToLoad);
    } else {
        res.send("Failed to get the data.");
    }
});

// Request 3 - Retrieve the Contents.
app.get("/retrieve-data", async (req, res) => {
    // We passed the access token in via the querystring
    const { access_token } = req.query;

    // An Etsy access token includes your shop/user ID
    // as a token prefix, so we can extract that too
    const user_id = access_token.split('.')[0];

    const requestOptions = {
        headers: {
            'x-api-key': clientID,
            // Scoped endpoints require a bearer token
            Authorization: `Bearer ${access_token}`,
        }
    };

    const response = await fetch(
        `https://api.etsy.com/v3/application/shops/26785613/listings?state=draft`,
        requestOptions
    );

    if (response.ok) {
        const listData = await response.json();
        // // Load the template with the first name as a template variable.
        // res.render("welcome", {
        //     first_name: userData.first_name
        // });
        res.send(listData);
    } else {
        res.send("oops");
    }
});


// Request 4 - Generate new access token from the refresh token.
app.get("/get-token", async (req, res) => {
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    const refreshToken = '417870418.eBihuefnLSDSAfzxvUZu5VKulKwg2daMlym0ixwrxxxPkJ9dK-AYpGoCMMEjlimEcnTrKAAKK0RqklNWfXp-Z53JVX';
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: clientID,
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

const shopName = "HappyByVimalYet";
app.get('/get-shop-details', async function(req, res){

    const { shop } = req.query;

    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': clientID,
        }
    };

    const response = await fetch(
        "https://api.etsy.com/v3/application/shops?shop_name="+ shop +"&api_key=" + keystring,
        requestOptions
    );

    if (response.ok) {
        const listData = await response.json();
        let shopID = (listData['results'][0]['shop_id'].toString());
        res.send(shopID);
    } else {
        res.send("oops");
    }

});

app.listen(3000);