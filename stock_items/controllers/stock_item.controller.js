const StockItem = require('../models/stock_item.model.js');
const MongoClient = require('mongodb').MongoClient;
const databaseConfig = require('../../config/database.config');
const validate = require('validate.js');
const collection = 'stockitems';

const SIconstraints = {
    name: {
        presence: true,
        length: {
            minimum: 2,
            maximum: 100,
            message: "must be between 2 and 100 characters"
        }
    },
    description: {
        presence: true,
        length: {
            minimum: 2,
            maximum: 100,
            message: "must be between 2 and 100 characters"
        }
    }
}

exports.create = (req, res) => {
    //validate request
    const item = {
        name: req.body.name,
        description: req.body.description
    }

    const validateMessage = validate(item, SIconstraints);

    if(validateMessage){
        return res.status(400).send(validateMessage);
    }

    //save item to database
    MongoClient.connect(databaseConfig.url, async (err, client) => {
        if(err){
            console.log(err);
        }
    
        const db = client.db(databaseConfig.database);
        
        await db.collection(collection).insertOne(item)
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Item."
                });
            });
        res.send(item);
        client.close();
    }); 
};

// Retrieve and return all stock items from the database.
exports.findAll = (req, res) => {
    
    MongoClient.connect(databaseConfig.url, async (err, client) => {
        if(err){
            console.log(err);
        }
    
        const db = client.db(databaseConfig.database);
        
        const items = await db.collection(collection).find().toArray()
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving items."
                });
            });
        res.send(items);
        
        client.close();
    }); 
};

// Find a single stock item with a id
exports.findOne = (req, res) => {
    MongoClient.connect(databaseConfig.url, async (err, client) => {
        if(err){
            console.log(err);
        }
    
        const db = client.db(databaseConfig.database);
        
        let id;
        try{
            id = new require('mongodb').ObjectID(req.params.siId);
        }
        catch(err){
            console.log(err);
        }

        const item = await db.collection(collection).findOne({'_id': id})
            .catch(err => {
                if(err.kind === 'ObjectId'){
                    return res.status(404).send({
                        message: " Catch Item not found with id " + req.params.siId
                    }); 
                }
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving items."
                });
            });
        if(item){
            res.send(item);
        } else {
            res.status(404).send({
                message: "Item not found with id " + req.params.siId
            })
        }
        client.close();
    }); 
};

// Update a stock item identified by the siId in the request
exports.update = (req, res) => {
    //validate request
    const update = {
        name: req.body.name,
        description: req.body.description
    }

    const validateMessage = validate(update, SIconstraints);

    if(validateMessage){
        return res.status(400).send(validateMessage);
    }

    MongoClient.connect(databaseConfig.url, async (err, client) => {
        if(err){
            console.log(err);
        }
    
        const db = client.db(databaseConfig.database);
        
        let id;
        try{
            id = new require('mongodb').ObjectID(req.params.siId);
        }
        catch(err){
            console.log(err);
        }

        const item = await db.collection(collection).findOneAndUpdate({'_id': id}, 
        {$set: update }, {returnOriginal: false})
            .catch(err => {
                if(err.kind === 'ObjectId'){
                    return res.status(404).send({
                        message: " Catch Item not found with id " + req.params.siId
                    }); 
                }
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving items."
                });
            });
        if(item){
            res.send(item.value);
        } else {
            res.status(404).send({
                message: "Item not found with id " + req.params.siId
            })
        }
        client.close();
    }); 
};

// Delete a note with the specified siId in the request
exports.delete = (req, res) => {
    MongoClient.connect(databaseConfig.url, async (err, client) => {
        if(err){
            console.log(err);
        }
    
        const db = client.db(databaseConfig.database);
        
        let id;
        try{
            id = new require('mongodb').ObjectID(req.params.siId);
        }
        catch(err){
            console.log(err);
        }

        const item = await db.collection(collection).findOneAndDelete({'_id': id})
            .catch(err => {
                if(err.kind === 'ObjectId'){
                    return res.status(404).send({
                        message: " Catch Item not found with id " + req.params.siId
                    }); 
                }
                res.status(500).send({
                    message: err.message || "Could not delete item with id " + req.params.siId
                });
            });
        if(item){
            res.send({message: "Item deleted successfully!"});
        } else {
            res.status(404).send({
                message: "Item not found with id " + req.params.siId
            })
        }
        client.close();
    }); 
};