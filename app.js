// Monolithic version

'use strict';

// Imports
const express = require('express');
const bodyParser = require("body-parser");
const { renderCaptcha } = require('./serverSide/serverFunctions')


// Intialize Express app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Static Files
app.use(express.static('public'));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

// Express routes
app.get('', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {"search": "", "data": ""});
});

app.get('/index', (req, res) => {
   res.render(__dirname + '/views/index.ejs', {"search": "", "data": ""});
});

app.get('/correct', (req, res) => {
    res.render(__dirname + '/views/correct.ejs');
 });

// Handles POST requesst made from / path
// Content of request is used in HTTP request made to Bing Image Search API
 app.post('/',(req,res) => {
  renderCaptcha(req, res);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
