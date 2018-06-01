'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000;
const router = require('./router');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

router(app);

app.listen(port, () => {
    console.log("Now listening on port " + port);
  });