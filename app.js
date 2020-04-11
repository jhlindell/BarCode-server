require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston');
const router = require('./router');
// const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

const remoteURL = process.env.DB_URL;
// const mongoURL = dbConfig.url;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'barcode.log' }),
  ],
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(remoteURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info('Successfully connected to the database');
    })
    .catch((err) => {
      logger.info(`Could not connect to the database. Exiting now... ${err}`);
      process.exit();
    });
}

router(app);

module.exports = app;
