// Monolithic version

// Imports
'use strict';

const net = require('net');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const bingSearch = require('./getBingImages')

// Intialize Express app
const app = express();

// Array contains bogus search terms (used for sending queries to image scraper microservice)
const irrelevantTerms = ["car", "smile", "cargoship", "bike", "darkness", "light", 
"milky way", "skiing", "sky", "ocean", "aerobics", "apples", "fire", "books"]


app.use(bodyParser.urlencoded({
    extended: false
 }));
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


// Receives three arrays and creates a new a array of 16 elements
// randomly selected from the three array arguments
// Returns the new array
function createArrMix(dataArray, badDataArray, badDataArray2) {
  let mixedDataArray = [];
  let i = 0;
      // Fills dataArray with image urls until there are 16 urls added
      while (i < 16) {
        // Generates random number for deciding from which array an image will be taken from
        // There is a 3/5 chance, an image will be taken from the search term relevant array
        let toss = Math.floor((Math.random()* 5) + 1);
        if (toss < 3) {
          // Randomly picks an image url from array
          let entry = dataArray[dataArray.length * Math.random() | 0];
          // Checks that the same image is not already been added to the mixedDataArray
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = dataArray[dataArray.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
        else if (toss == 4) {
          let entry = badDataArray[badDataArray.length * Math.random() | 0];
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = badDataArray[badDataArray.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
        else {
         let entry = badDataArray2[badDataArray2.length * Math.random() | 0];
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = badDataArray2[badDataArray2.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
      }
      return mixedDataArray;
}


async function renderCaptcha(req, res) {
    // If user tries to generate image grid with no search term
  if (req.body.search_term == ""){
  res.render('index.ejs', {"search": "", "data": ""});
  return;
  }
  // Initializes arrays used for containing image urls
  let dataArray = [];
  let badDataArray = [];
  let badDataArray2 = [];

  let bogusSearchTerm1 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
  // Loops while user search term is the same as bogus search term
  while (bogusSearchTerm1 == req.body.search_term) {
    bogusSearchTerm1 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
  }
  let bogusSearchTerm2 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
  while (bogusSearchTerm2 == req.body.search_term || bogusSearchTerm2 == bogusSearchTerm1) {
    bogusSearchTerm2 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
  }

  let images = await bingSearch.getImages(req.body.search_term);
  for (const url in images) {
    dataArray.push({searched: 1, url: images[url]});
  }

  images = await bingSearch.getImages(bogusSearchTerm1);
  for (const url in images) {
    badDataArray.push({searched: 0, url: images[url]});
  }

  images =  await bingSearch.getImages(bogusSearchTerm2);
  for (const url in images) {
    badDataArray2.push({searched: 0, url: images[url]});
  }

  let searchTerm = [req.body.search_term];

  if ( dataArray.length < 16 || badDataArray.length < 16 || badDataArray2.length < 16 ) {
    res.render('index.ejs', {"search": searchTerm, "data": ""});
  }
  else {
   let mixedDataArray = createArrMix(dataArray, badDataArray, badDataArray2);

    // Renders index.ejs with object containing user search term and mixedDataArray
    res.render('index.ejs', {"search": searchTerm, "data": mixedDataArray});
  }
}

module.exports = app;
