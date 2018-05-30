'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
    console.log("Now listening on port " + port);
  });