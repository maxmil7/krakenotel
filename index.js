//initialize tracing
require('./tracing');

//Create and start app
const express = require('express');
const kraken = require('kraken-js');

const app = express();
app.use(kraken());

app.listen(7000);