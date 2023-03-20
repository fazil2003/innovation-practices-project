const mongoose = require("mongoose");
const db = require("./connect-db");

// Create an schema
var usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

var usersModel = mongoose.model('users', usersSchema);
// module.exports = mongoose.model("Products", productsModel);
module.exports = usersModel;