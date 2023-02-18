const express = require('express');
const cors = require('cors');
const path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// create application/json parser
var jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.urlencoded({ extended: false }));

// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());

// Etsy OAuth
const etsyOAuth = require('./routes/etsy-oauth');
app.use('/', etsyOAuth);

app.use('/etsy', etsyOAuth);

// MongoDB Functions
const mongoDBFunc = require('./routes/mongodb-func');
app.use('/mongodb', mongoDBFunc);

app.listen(port, () => {
    console.log("Server is running");
});