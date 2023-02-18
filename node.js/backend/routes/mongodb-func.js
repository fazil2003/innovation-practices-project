const router = require('express').Router();

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');
const db = require('./models/connect-db');
var ObjectId = require('mongodb').ObjectId;
var usersModel = require('./models/user-model');
var shopsModel = require('./models/shop-model');

// Insert a new data into the database
router.route('/login').post((req, res)=>{

    usersModel.find({ username: req.body.username}, async function (err, results) {
        if (err){
            res.send("fail")
        }
        else{
            if (!results.length){
                res.send("fail")
            }
            else{
                if (await bcrypt.compare(req.body.password, results[0]['password']) ){
                    res.send('success')
                }
                else{
                    res.send('fail')
                }
            }
        }
    });

    
});

// Insert a new data into the database
router.route('/insert').post(async (req, res)=>{
    
    var dataUsername = req.body.username;
    var dataPassword = req.body.password;
    var dataEmail = req.body.email;
    var dataApiKey = req.body.api_key;
    var dataSharedSecret = req.body.shared_secret;

    try{
        const hashedPassword = await bcrypt.hash(dataPassword, saltRounds);
        const insertData = await usersModel.create({
            username: dataUsername,
            password: hashedPassword,
            email: dataEmail,
            api_key: dataApiKey,
            shared_secret: dataSharedSecret,
            access_token: '',
            refresh_token: '',
            time_limit: 0,
            last_updated: new Date()
        });
            
        insertData.save((err, doc) => {
            if (!err){
                // Store the Cookie
                res.cookie('email', dataEmail, { maxAge: 900000, httpOnly: true });
                res.redirect('/require-access');
            }
            else{
                res.send('error');
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
    
});

// Insert a new shop into the database
router.route('/shop/insert').get(async (req, res)=>{

    try{
        const insertData = await shopsModel.create({
            shop_name: 'Sample Shop',
            shop_id: 123123,
            shop_owner: 'johndoe',
            last_synched: new Date()
        });
            
        insertData.save((err, doc) => {
            if (!err){
                res.send("success")
            }
            else{
                res.send('error');
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
    
});

// Insert a new data into the database
router.route('/shops/get').get((req, res)=>{

    let q = "";
    if(req.query.q){

        q = req.query.q;
        // console.log("q="+q);

        shopsModel.find({}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });    

    }
    else{
        shopsModel.find({}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });
    }


    
});

module.exports = router;