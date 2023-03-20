const mongoose = require("mongoose");
const db = require("./connect-db");

// Create an schema
var inventoriesSchema = new mongoose.Schema({
    shop_id: Number,
    unique_name: String,
    full_name: String,
    stocks: Number,
    last_updated: Date
});

var inventoriesModel = mongoose.model('inventories', inventoriesSchema);
module.exports = inventoriesModel;