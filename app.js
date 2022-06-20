// Imports
const net = require('net');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require("body-parser");

// Intialize Express app
const app = express();
// Set port
const port = 5000;

// Array contains bogus search terms (used for sending queries to image scraper microservice)
const irrelevantTerms = ["car", "smile", "cargoship", "bike", "darkness", "light", "milky way", "skiing", "sky", "ocean", "aerobics"]


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
// Content of request is used to send query to image scraper at localhost:7440
 app.post('/',(req,res) => {

  // If user tries to generate image grid with no search term
  if (req.body.search_term == ""){
    res.render('index.ejs', {"search": "", "data": ""});
    return;
  }
  // Initializes arrays used for containing image urls
    var dataArray = [];
    var badDataArray = [];
    var badDataArray2 = [];
    //var mixedDataArray = [];

    // Creates socket for communicating with microservice
     var client = new net.Socket();
     client.connect('7440', 'localhost', function() {
       // Server-side logging
        console.log('first request');
        // Initalizes message dictionary with key:value pair query:search_term sent to server via POST request
        var message = {query:req.body.search_term}
        // Converts message to JSON string
        var jsonMessage = JSON.stringify(message);
        // sends message (a query) to microservice
        client.write(jsonMessage);
        });
    
    // Upon receiving a response from the microservice
    client.on('data', function(data) {
      // Parses JSON string
      parsedData = JSON.parse(data);
      
      // Adds each image url in response to dataArray
      for (const url in parsedData) {
        // value of key 'searched' set to 1 to indicate this image url is relevant to search term
            dataArray.push({searched: 1, url: parsedData[url]});
      }

      var client2 = new net.Socket();
      client2.connect('7440', 'localhost', function() {
        console.log('second request');
        // Randomly picks a bogus search term
        bogusSearchTerm1 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
        // Loops while user search term is the same as bogus search term
        while (bogusSearchTerm1 == req.body.search_term) {
          bogusSearchTerm1 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
        }
      // Initalizes message dictionary with key:value pair query:bogus search term
      var message = {query:bogusSearchTerm1};
        var jsonMessage = JSON.stringify(message);
        client2.write(jsonMessage);
        });

      client2.on('data', function(data) {
        parsedData = JSON.parse(data);
        for (const url in parsedData) {
           // value of key 'searched' set to 0 to indicate this image url is from bogus search term
            badDataArray.push({searched: 0, url: parsedData[url]});
          
      }
      // Repeats above code for gathering more bogus images of a different bogus search term
      var client3 = new net.Socket();
        client3.connect('7440', 'localhost', function() {
        console.log('third request');
        bogusSearchTerm2 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
        while (bogusSearchTerm2 == req.body.search_term || bogusSearchTerm2 == bogusSearchTerm1) {
          bogusSearchTerm2 = irrelevantTerms[irrelevantTerms.length * Math.random() | 0];
        }
      var message = {query:bogusSearchTerm2};
        var jsonMessage = JSON.stringify(message);
        client3.write(jsonMessage);
        });

        client3.on('data', function(data) {
          parsedData = JSON.parse(data);
          for (const url in parsedData) {

              badDataArray2.push({searched: 0, url: parsedData[url]});            
        }

      // Closes connections with microservice
      client.destroy();
      client2.destroy()
      client3.destroy();

      var searchTerm = [req.body.search_term];

      if ( dataArray.length < 15 || badDataArray.length < 15 || badDataArray2.length < 15 ) {
        res.render('index.ejs', {"search": searchTerm, "data": ""});
      }
      else {
        mixedDataArray = createArrMix(dataArray, badDataArray, badDataArray2);
        // Renders index.ejs with object containing user search term and mixedDataArray
        res.render('index.ejs', {"search": searchTerm, "data": mixedDataArray});
      }
        });
      });
    });
 });
app.listen(port, () => console.info(`App listening on port ${port}`))


// Receives three arrays and creates a new a array of 16 elements
// randomly selected from the three array arguments
// Returns the new array
function createArrMix(dataArray, badDataArray, badDataArray2) {
  var mixedDataArray = [];
  var i = 0;
      // Fills dataArray with image urls until there are 16 urls added
      while (i < 16) {
        // Generates random number for deciding from which array an image will be taken from
        // There is a 3/5 chance, an image will be taken from the search term relevant array
        var toss = Math.floor((Math.random()* 5) + 1);
        if (toss < 3) {
          // Randomly picks an image url from array
          entry = dataArray[dataArray.length * Math.random() | 0];
          // Checks that the same image is not already been added to the mixedDataArray
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = dataArray[dataArray.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
        else if (toss == 4) {
          entry = badDataArray[badDataArray.length * Math.random() | 0];
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = badDataArray[badDataArray.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
        else {
          entry = badDataArray2[badDataArray2.length * Math.random() | 0];
          while (mixedDataArray.indexOf(entry) > -1) {
            entry = badDataArray2[badDataArray2.length * Math.random() | 0];
          }
          mixedDataArray.push(entry);
          i++;
        }
      }
      return mixedDataArray;
}
