const mongoose = require("mongoose");
const db = require("./connect-db");

// create an schema
var usersSchema = new mongoose.Schema({
    name: String,
    password: String
});

var usersModel = mongoose.model('users', usersSchema);
// module.exports = mongoose.model("Products", productsModel);
module.exports = usersModel;