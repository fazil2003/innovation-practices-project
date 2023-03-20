var mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// MongoDB Compass
// mongoose.connect('mongodb://127.0.0.1:27017/etsy-api', {useNewUrlParser: true, useUnifiedTopology: true});

// MongoDB Atlas
mongoose.connect('mongodb+srv://fazil2003:fazil2003@boston-project.czhigul.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var conn = mongoose.connection;

conn.on('connected', function() {
    console.log('Database is connected successfully');
});

conn.on('disconnected',function(){
    console.log('Database is disconnected successfully');
});

conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;