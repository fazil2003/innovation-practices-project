const router = require('express').Router();

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');
const db = require('./models/connect-db');
var ObjectId = require('mongodb').ObjectId;
var usersModel = require('./models/user-model');

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

module.exports = router;