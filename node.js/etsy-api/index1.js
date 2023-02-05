var express = require('express');
var app = express();


const path = require('path');




// LINKS
// Etsy Your Apps Link: https://www.etsy.com/developers/your-apps
// OLD URL: https://horal-extensions.000webhostapp.com

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');


// Test Requests.
app.get('/', function(req, res){
   res.send("Hello world!");
});

app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/help', function(req, res) {
    var q = req.query.code;
    var p = req.query.code;
    res.render('get', {'q': q, 'p': p});
});

app.get('/get', function(req, res){
    var q = req.query.q;
    var p = req.query.p;
    res.render('get', {'q': q, 'p': p});
});

// Get the data from mongodb.
app.get('/mongodb/get', function(req, res){
    
    // MongoClient.connect(url, { useNewUrlParser: true })
    // .then((client) => {
    //     const db = client.db('etsy-api');
    //     const collection = db.collection('users');
    //     return collection.find({}).toArray();
    // })
    // .then((response) => console.log(response))
    // .catch((error) => console.error(error));

    // res.send("Hello world!");
});

function comparePassword(plaintextPassword, hash) {
    bcyrpt.compare(plaintextPassword, hash)
    .then(result => {return result})
    .catch(err => {console.log(err)})
}

app.listen(3000);