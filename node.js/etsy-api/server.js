const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());

// Etsy OAuth
const etsyOAuth = require('./routes/etsy-oauth');
app.use('/', etsyOAuth);

// MongoDB Functions
const mongoDBFunc = require('./routes/mongodb-func');
app.use('/mongodb', mongoDBFunc);

app.listen(port, () => {
    console.log("Server is running");
});