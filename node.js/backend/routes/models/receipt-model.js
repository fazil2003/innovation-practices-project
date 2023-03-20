const mongoose = require("mongoose");
const db = require("./connect-db");

// // Create an schema
// var receiptsSchema = new mongoose.Schema({
//     receipt_id: Number,
//     created_timestamp: Number,
//     updated_timestamp: Number,
//     shop_id: Number,
//     is_processed: Boolean
// });

// Create an schema
var receiptsSchema = new mongoose.Schema({}, { strict: false });

var receiptsModel = mongoose.model('receipts', receiptsSchema);
module.exports = receiptsModel;