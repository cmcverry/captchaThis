const { getImages } = require('./getBingImages')
const { bogusTerms, cachedUrls } = require('./appData')

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
    let searchTerm = req.body.search_term;
  
    let bogusSearchTerm1 = bogusTerms[bogusTerms.length * Math.random() | 0];
    // Loops while user search term is the same as bogus search term
    while (bogusSearchTerm1 == searchTerm) {
      bogusSearchTerm1 = bogusTerms[bogusTerms.length * Math.random() | 0];
    }
  
    let bogusSearchTerm2 = bogusTerms[bogusTerms.length * Math.random() | 0];
      // Loops while user search term is the same as bogus search term
    while (bogusSearchTerm2 == searchTerm || bogusSearchTerm2 == bogusSearchTerm1) {
      bogusSearchTerm2 = bogusTerms[bogusTerms.length * Math.random() | 0];
    }
  
    validDataArray = await createImagesArr(searchTerm, 1);
    invalidDataArray = await createImagesArr(bogusSearchTerm1, 0);
    invalidDataArray2 = await createImagesArr(bogusSearchTerm2, 0);
  
    // Checks that a sufficient number of images were retrieved
    if ( validDataArray.length < 16 || invalidDataArray.length < 16 || invalidDataArray2.length < 16 ) {
      res.render('index.ejs', {"search": [searchTerm], "data": ""});
    } else {
    let mixedDataArray = createArrMix(validDataArray, invalidDataArray, invalidDataArray2);
    
    addToBogus(searchTerm);
      // Renders index.ejs with object containing user search term and mixedDataArray
      res.render('index.ejs', {"search": [searchTerm], "data": mixedDataArray});
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
      // There is a 2/5 chance, an image will be taken from the search term relevant array
      let toss = Math.floor((Math.random()* 10) + 1);
      if (toss <= 4) {
        // Randomly picks an image url from array
        let entry = validDataArray[validDataArray.length * Math.random() | 0];
        // Checks that the same image is not already been added to the mixedDataArray
        while (mixedDataArray.indexOf(entry) > -1) {
          entry = validDataArray[validDataArray.length * Math.random() | 0];
        }
        mixedDataArray.push(entry);
        i++;
      }
      else if (toss > 4 && toss < 8) {
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
  
  // Receives search, a string representing a search term, and valid,
  //  a integer value indicating whether this is the user's search term
  // Calls getImages, pushes each image, represented as an object, into
  //  an array 
  // Returns array of image objects
  async function createImagesArr(search, valid) {
    let imageArr = [];
    let images = checkCache(search);
    if (images === undefined) {
      images = await getImages(search);
      cachedUrls.set(search, images);
    }
    for (const img in images) {
      imageArr.push({searched: valid, url: images[img]});
    }
    return imageArr;
  }
  
  // Checks cache for previous urls for search term
  function checkCache(searched) {
    let urls = cachedUrls.get(searched);
    return urls;
  }
  
  // Adds search term to bogusTerms array if not already included
  function addToBogus(searched) {
    if (!bogusTerms.includes(searched)){
      bogusTerms.push(searched);
    } 
  }

module.exports = { addToBogus, checkCache, createImagesArr, createArrMix, renderCaptcha };