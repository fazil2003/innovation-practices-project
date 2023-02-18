const mongoose = require("mongoose");
const db = require("./connect-db");

// Create an schema
var shopsSchema = new mongoose.Schema({
    shop_name: String,
    shop_id: Number,
    shop_owner: String,
    last_synched: Date,
});

var shopsModel = mongoose.model('shops', shopsSchema);
// module.exports = mongoose.model("Products", productsModel);
module.exports = shopsModel;