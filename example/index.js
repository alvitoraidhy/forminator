'use strict';

const express = require('express');

// Configuring app
const app = express(); // create Express app
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./assets'));

// Create current app object
const current = {app};

// Import routes
require('./routes/index').init(current);

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listening on ${port}`);
});