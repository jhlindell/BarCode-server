const StockItem = require('../models/stock_item.model');
const mongoose = require('mongoose');
const { getIdFromToken } = require('../services/auth');

// save a single stock item to the database
exports.create = (name, description, token) => {
  // get userId from the header token
  let userId;
  try {
    userId = getIdFromToken(token);
  } catch (err) {
    throw err;
  }

  const item = new StockItem({
    name, description, createdBy: userId, updatedBy: userId,
  });
  const error = item.validateSync();
  if (error) {
    throw error;
  } else {
    return item.save()
      .then(data => data)
      .catch((err) => {
        throw err;
      });
  }
};

// Retrieve and return all stock items from the database.
exports.findAll = (page, limit, search) => {
  const query = {};
  if (search !== undefined) {
    query.name = { $regex: search, $options: 'i' };
  }
  const options = {
    page,
    limit,
    sort: { name: 1 },
  };

  return StockItem.paginate(query, options)
    .then((response) => {
      const result = Object.assign(response);
      const cleanedResult = response.docs.map((item) => {
        const cleanedItem = {
          _id: item._id,
          name: item.name,
          description: item.description,
        };
        return cleanedItem;
      });
      result.docs = cleanedResult;
      return result;
    }).catch((err) => {
      throw err;
    });
};

// Find a single stock item with a id
exports.findOne = (id) => {
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  return StockItem.findById(objectId)
    .then((item) => {
      if (item) {
        const cleanedItem = {
          _id: item._id,
          name: item.name,
          description: item.description,
        };
        return cleanedItem;
      }
      throw new Error(`Item not found with id: ${id}`);
    }).catch((err) => {
      throw err;
    });
};

// Update a stock item identified by the siId in the request
exports.update = (name, description, id, token) => {
  // make sure that the item id supplied is a valid Mongoose ObjectId
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  // get userId from the header token
  let userId;
  try {
    userId = getIdFromToken(token);
  } catch (err) {
    throw err;
  }
  const item = new StockItem({
    name,
    description,
  });
  const error = item.validateSync();
  if (error) {
    throw error;
  } else {
    return StockItem.findByIdAndUpdate(
      objectId,
      { name, description, updatedBy: userId }, { new: true },
    ).then((stockitem) => {
      if (stockitem) {
        return stockitem;
      }
      throw new Error(`Item not found with id: ${id}`);
    }).catch((err) => {
      throw err;
    });
  }
};

// Delete a stockitem with the specified siId in the request
exports.delete = (id) => {
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  return StockItem.findByIdAndRemove(objectId)
    .then((item) => {
      if (item) {
        return item;
      }
      throw new Error(`Item not found with id: ${id}`);
    })
    .catch((err) => {
      throw err;
    });
};
