const assert = require('assert');
const mongoose = require('mongoose');
const winston = require('winston');
const controller = require('../../controllers/stock_item.controller');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'barcode.log' }),
  ],
});

const StockItem = mongoose.model('StockItem');

describe('Stock Item controller', () => {
  it('POST to create should create a stock item', async () => {
    try {
      await controller.create('Smith & Cross Rum', 'Da Funk Bomb');
    } catch (err) {
      logger.info(`${err}`);
    }
    const item = await StockItem.findOne({ name: 'Smith & Cross Rum' });
    assert(item.name === 'Smith & Cross Rum');
  });

  it('POST to create with incomplete object should return error message', async () => {
    try {
      await controller.create('Smith & Cross Rum');
    } catch (err) {
      assert(err.name === 'ValidationError');
    }
  });

  it('findAll should return all stock items', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: 'Da Funk Bomb' });
    const stockItem2 = new StockItem({ name: 'Campari', description: 'makes other things better' });
    const stockItem3 = new StockItem({ name: 'Cocchi di Torrino', description: 'The third ingredient' });
    await stockItem.save();
    await stockItem2.save();
    await stockItem3.save();
    const items = await controller.findAll();
    assert(items.total === 3);
  });

  it('findOne with an id should get a single stock item', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: 'Da Funk Bomb' });
    await stockItem.save();
    const item = await controller.findOne(stockItem._id);
    assert(item._id.toString() === stockItem._id.toString());
  });

  it('findOne with a bad id should return an error message', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: 'Da Funk Bomb' });
    await stockItem.save();
    try {
      await controller.findOne('5b46486532a4803fbcb78942');
    } catch (err) {
      assert(err.message === 'Item not found with id: 5b46486532a4803fbcb78942');
    }
  });

  it('PUT to /api/stock_items/:id can update a record', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: 'Da Funk Bomb' });
    await stockItem.save();
    const updated = await controller.update('Smith & Cross Rum', "Jamaica's Finest!!!", stockItem._id);
    assert(updated.description === "Jamaica's Finest!!!");
  });

  it('PUT to /api/stock_items/:id with a bad id will return an error message', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: 'Da Funk Bomb' });
    await stockItem.save();
    try {
      await controller.update('Smith & Cross Rum', "Jamaica's Finest!!!", '5b46486532a4803fbcb78942');
    } catch (err) {
      assert(err.message === 'Item not found with id: 5b46486532a4803fbcb78942');
    }
  });

  it('DELETE to /api/drivers/:id can delete a record', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: "Jamaica's Finest" });
    await stockItem.save();
    const item = await controller.delete(stockItem._id);
    assert(item._id.toString() === stockItem._id.toString());
  });

  it('DELETE to /api/drivers/:id with a bad id will return an error', async () => {
    const stockItem = new StockItem({ name: 'Smith & Cross Rum', description: "Jamaica's Finest" });
    await stockItem.save();
    try {
      await controller.delete('asdfjkhasdfkajhdf');
    } catch (err) {
      assert(err.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    }
  });
});
