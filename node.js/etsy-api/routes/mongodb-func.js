const router = require('express').Router();

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');
const db = require('./models/connect-db');
var ObjectId = require('mongodb').ObjectId;
var usersModel = require('./models/user-model');

router.route('/insert').get(async (req, res)=>{

    try{
        const hashedPassword = await bcrypt.hash('fazil123', saltRounds);
        const insertData = await usersModel.create({
            name: 'fazil',
            password: hashedPassword
        });
            
        insertData.save((err, doc) => {
            if (!err){
                res.send('Data added successfully');
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