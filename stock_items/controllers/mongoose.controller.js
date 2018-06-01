const StockItem = require('../models/stock_item.model.js');

exports.create = (req, res) => {
    //validate request

    if(!req.body.name || ! req.body.description){
        return res.status(400).send({
            message: "stock item name or description cannot be empty"
        });
    }
    //create new item
    const item = new StockItem({ 
        name: req.body.name,
        description: req.body.description
    });
    //save item in database
    item.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Item."
            });
        });
};

// Retrieve and return all stock items from the database.
exports.findAll = (req, res) => {
    StockItem.find()
        .then(items => {
            res.send(items);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Find a single stock item with a id
exports.findOne = (req, res) => {
    StockItem.findById(req.params.siId)
        .then(item => {
            if(!item){
                return res.status(404).send({
                    message: "Item not found with id " + req.params.siId
                });
            }
            res.send(item);
        }).catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message: "Item not found with id " + req.params.siId
                }); 
            }
            res.status(500).send({
                message: err.message || "Error retrieving item with id " + req.params.siId
            });
        });
};

// Update a stock item identified by the siId in the request
exports.update = (req, res) => {
    //validate request
    if(!req.body.name || !req.body.description){
        return res.status(400).send({
            message: "Item content can not be empty"
        });
    }

    //find note and update it with the request body
    StockItem.findByIdAndUpdate(req.params.siId, {
        name: req.body.name,
        description: req.body.description
    }, {new:true})
    .then(item => {
        if(!item){
            return res.status(404).send({
                message: "Item not found with id " + req.params.siId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.siId
            });                
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.siId
        });
    });
};

// Delete a note with the specified siId in the request
exports.delete = (req, res) => {
    StockItem.findByIdAndRemove(req.params.siId)
    .then(item => {
        if(!item){
            return res.status(404).send({
                message: "Item not found with id " + req.params.siId
            });
        }
        res.send({message: "Item deleted successfully!"});
    })
    .catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.siId
            });                
        }
        return res.status(500).send({
            message: "Could not delete item with id " + req.params.siId
        });
    })
};