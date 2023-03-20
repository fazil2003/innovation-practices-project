const router = require('express').Router();

var bcrypt = require('bcrypt');
const saltRounds = 10;

var ObjectId = require('mongodb').ObjectId;

var mongoose = require('mongoose');
const db = require('./models/connect-db');
var ObjectId = require('mongodb').ObjectId;
var usersModel = require('./models/user-model');
var shopsModel = require('./models/shop-model');
var inventoryModel = require('./models/inventory-model');

// Insert a new shop into the database
router.route('/insert').post(async (req, res)=>{

    let shopID = Number(req.body.shop_id);

    try{

        // Update the data.
        if(req.body.inventory_id != 0){
            var myQuery = { _id: new ObjectId(req.body.inventory_id) };
            var newValues = { $set: {
                    shop_id: shopID,
                    unique_name: req.body.unique_name,
                    full_name: req.body.full_name,
                    stocks: req.body.stocks,
                    last_updated: new Date()
                }
            };
            db.collection("inventories").updateOne(myQuery, newValues, function(err, doc) {
                if (err) throw err;
                res.send("success");
            });
        }
        // Insert the new data.
        else{

            const insertData = await inventoryModel.create({
                shop_id: shopID,
                unique_name: req.body.unique_name,
                full_name: req.body.full_name,
                stocks: req.body.stocks,
                last_updated: new Date()
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
    
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
    
});

// Get the shops.
router.route('/get').get((req, res)=>{

    let q = "";
    let shopID = req.query.shop_id;
    if(req.query.q){

        q = req.query.q;

        inventoryModel.find({shop_id: shopID}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });    

    }
    else{
        inventoryModel.find({shop_id: shopID}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
            }
        });
    }


    
});

router.route('/delete').post((req, res) => {
    var myquery = { _id: new ObjectId(req.body.inventory_id) };
    db.collection("inventories").deleteOne(myquery, function(err, res) {
        if (err) throw err;
    });
    res.send("success");
});

module.exports = router;