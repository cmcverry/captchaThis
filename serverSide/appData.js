// Array contains bogus search terms (used for initial bogus queries to Bing Image Search API)
const bogusTerms = ["car", "smile", "cargoship", "bike", "darkness", "light", 
"milky way", "skiing", "sky", "ocean", "aerobics", "apples", "fire", "books"];

// Hashmap contains collections of urls for previous search terms
let cachedUrls = new Map();

module.exports = { bogusTerms, cachedUrls };

