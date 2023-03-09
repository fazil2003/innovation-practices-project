const router = require('express').Router();

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');
const db = require('./models/connect-db');
var ObjectId = require('mongodb').ObjectId;
var usersModel = require('./models/user-model');
var shopsModel = require('./models/shop-model');

// Check the login credentials of the user.
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
                    // res.cookie('username', results[0]['username'], { maxAge: 900000, httpOnly: true });
                    // res.cookie('email', results[0]['email'], { maxAge: 900000, httpOnly: true });
                    // console.log(req.cookies.email);

                    // if(results[0]['etsy_authorized']){
                    //     res.send("success:" + results[0]['email']);
                    // }
                    // else{
                    //     res.send("authorize:" + results[0]['email']);
                    // }

                    res.send("success:" + results[0]['email']);
                    
                }
                else{
                    res.send('fail')
                }
            }
        }
    });

    
});

// Register the new user.
router.route('/register').post(async (req, res)=>{
    
    var dataUsername = req.body.username;
    var dataPassword = req.body.password;
    var dataEmail = req.body.email;

    try{
        const hashedPassword = await bcrypt.hash(dataPassword, saltRounds);
        const insertData = await usersModel.create({
            username: dataUsername,
            password: hashedPassword,
            email: dataEmail
        });
            
        insertData.save((err, doc) => {
            if (!err){
                // Store the Cookie
                // res.cookie('email', dataEmail, { maxAge: 900000, httpOnly: true });
                // res.redirect('/require-access');
                res.send("success");
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
router.route('/shops/insert').post(async (req, res)=>{

    try{
        const insertData = await shopsModel.create({
            shop_name: req.body.shop_name,
            shop_id: req.body.shop_id,
            shop_owner: req.body.shop_owner,
            api_key: req.body.api_key,
            shared_secret: req.body.shared_secret,
            etsy_authorized: false,
            access_token: "",
            refresh_token: "",
            time_limit: 0,
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

// Get the shops.
router.route('/shops/get').get((req, res)=>{

    let q = "";
    let shopOwner = req.query.shop_owner;
    if(req.query.q){

        q = req.query.q;
        // console.log("q="+q);

        shopsModel.find({shop_owner: shopOwner}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });    

    }
    else{
        shopsModel.find({shop_owner: shopOwner}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });
    }


    
});

// Check the validity of access token.
router.route('/token/validity').post((req, res) => {

    let shopID = req.body.shop_id;

    shopsModel.find({ shop_id: shopID}, async function (err, results) {

        let responseType = "fail";
        let tokenType = "access";
        let tokenData = "";
        let apiKey = "";

        if (err){
            responseType = "fail";
        }
        else{
            if (!results.length){
                responseType = "fail";
            }
            else{
                let currentTime = new Date();
                let secondsDifference = Math.abs(new Date(results[0]['last_synched']).getTime() - currentTime.getTime()) / 1000;
                if (secondsDifference > results[0]['time_limit']){
                    // res.send("refresh:" + results[0]['refresh_token']);
                    responseType = "success";
                    tokenType = "refresh";
                    tokenData = results[0]['refresh_token'];
                }
                else{
                    // res.send("access:" + results[0]['access_token']);
                    responseType = "success";
                    tokenType = "access";
                    tokenData = results[0]['access_token'];
                }
                apiKey = results[0]['api_key'];

            }
        }

        const responseData = {
            response_type: responseType,
            token_type: tokenType,
            token_data: tokenData,
            api_key: apiKey
        }
         
        const jsonContent = JSON.stringify(responseData);
        res.send(jsonContent);

    });

});

// [Not Used] Check the validity of access token.
router.route('/token/get/api_key').post((req, res) => {

    let username = req.body.username;

    usersModel.find({ username: username}, async function (err, results) {
        if (err){
            res.send("fail")
        }
        else{
            if (!results.length){
                res.send("fail")
            }
            else{
                res.send(results[0]['api_key']);
            }
        }
    });

});

// Update the Access tokens.
router.route('/update-tokens').post(async (req, res)=>{

    try{
        var myQuery = { shop_id: req.body.shop_id };
        var newValues = { $set:
            {
                access_token: req.body.access_token,
                refresh_token: req.body.refresh_token,
                time_limit: req.body.time_limit,
                last_synched: new Date()
            }
        };
        db.collection("shops").updateOne(myQuery, newValues, function(err, resMongo) {
            if (err) throw err;
            res.send("success");
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
    
});

module.exports = router;