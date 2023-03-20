const mongoose = require("mongoose");
const db = require("./connect-db");

// Create an schema
var shopsSchema = new mongoose.Schema({
    shop_name: String,
    shop_id: Number,
    shop_owner: String,
    api_key: String,
    shared_secret: String,
    etsy_authorized: Boolean,
    access_token: String,
    refresh_token: String,
    time_limit: Number,
    last_synched: Date,
    last_epoch_time: Number
});

var shopsModel = mongoose.model('shops', shopsSchema);
module.exports = shopsModel;