const mongoose = require("mongoose");
const db = require("./connect-db");

// Create an schema
var usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    api_key: String,
    shared_secret: String,
    access_token: String,
    refresh_token: String,
    time_limit: Number,
    last_updated: Date
});

var usersModel = mongoose.model('users', usersSchema);
// module.exports = mongoose.model("Products", productsModel);
module.exports = usersModel;