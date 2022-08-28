// Monolithic version

'use strict';

// Imports
const express = require('express');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const { getImages } = require('./getBingImages')


// Intialize Express app
const app = express();

// Array contains bogus search terms (used for sending queries to image scraper microservice)
const bogusTerms = ["car", "smile", "cargoship", "bike", "darkness", "light", 
"milky way", "skiing", "sky", "ocean", "aerobics", "apples", "fire", "books"]


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


async function renderCaptcha(req, res) {
  // If user tries to generate image grid with no search term
  if (req.body.search_term == ""){
    res.render('index.ejs', {"search": "", "data": ""});
    return;
  }

  // Initializes arrays used for containing image urls
  let validDataArray = [];
  let invalidDataArray = [];
  let invalidDataArray2 = [];

  let bogusSearchTerm1 = bogusTerms[bogusTerms.length * Math.random() | 0];
  // Loops while user search term is the same as bogus search term
  while (bogusSearchTerm1 == req.body.search_term) {
    bogusSearchTerm1 = bogusTerms[bogusTerms.length * Math.random() | 0];
  }

  let bogusSearchTerm2 = bogusTerms[bogusTerms.length * Math.random() | 0];
  while (bogusSearchTerm2 == req.body.search_term || bogusSearchTerm2 == bogusSearchTerm1) {
    bogusSearchTerm2 = bogusTerms[bogusTerms.length * Math.random() | 0];
  }

  let searchTerm = [req.body.search_term];
  validDataArray = await createImagesArr(searchTerm, 1);
  invalidDataArray = await createImagesArr(bogusSearchTerm1, 0);
  invalidDataArray2 = await createImagesArr(bogusSearchTerm2, 0);

  // Checks that a sufficient number of images were retrieved
  if ( validDataArray.length < 16 || invalidDataArray.length < 16 || invalidDataArray2.length < 16 ) {
    res.render('index.ejs', {"search": searchTerm, "data": ""});
  } else {
  let mixedDataArray = createArrMix(validDataArray, invalidDataArray, invalidDataArray2);

    // Renders index.ejs with object containing user search term and mixedDataArray
    res.render('index.ejs', {"search": searchTerm, "data": mixedDataArray});
  }
}

// Receives three arrays and creates a new a array of 16 elements
// randomly selected from the three array arguments
// Returns the new array
function createArrMix(validDataArray, invalidDataArray, invalidDataArray2) {
  let mixedDataArray = [];
  let i = 0;

  // Fills validDataArray with image urls until there are 16 urls added
  while (i < 16) {
    // Generates random number for deciding from which array an image will be taken from
    // There is a 3/5 chance, an image will be taken from the search term relevant array
    let toss = Math.floor((Math.random()* 5) + 1);
    if (toss < 3) {
      // Randomly picks an image url from array
      let entry = validDataArray[validDataArray.length * Math.random() | 0];
      // Checks that the same image is not already been added to the mixedDataArray
      while (mixedDataArray.indexOf(entry) > -1) {
        entry = validDataArray[validDataArray.length * Math.random() | 0];
      }
      mixedDataArray.push(entry);
      i++;
    }
    else if (toss == 4) {
      let entry = invalidDataArray[invalidDataArray.length * Math.random() | 0];
      while (mixedDataArray.indexOf(entry) > -1) {
        entry = invalidDataArray[invalidDataArray.length * Math.random() | 0];
      }
      mixedDataArray.push(entry);
      i++;
    }
    else {
      let entry = invalidDataArray2[invalidDataArray2.length * Math.random() | 0];
      while (mixedDataArray.indexOf(entry) > -1) {
        entry = invalidDataArray2[invalidDataArray2.length * Math.random() | 0];
      }
      mixedDataArray.push(entry);
      i++;
    }
  }
  return mixedDataArray;
}

// Recieves search, a string representing a search term, and valid,
//  a integer value indicating whether this is the user's search term
// Calls getImages, pushes each image, represented as an object, into
//  an array 
// Returns array of image objects
async function createImagesArr(search, valid) {
  let imageArr = [];
  let images = await getImages(search);
  for (const img in images) {
    imageArr.push({searched: valid, url: images[img]});
  }
  return imageArr;
}

module.exports = app;
