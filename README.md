# Captcha This

Captcha This randomly generates a grid of images (essentially, an image captcha) corresponding to a user-entered search term.

Captcha This is deployed on Google App Engine and uses the Bing Image Search API for gathering image URLs. Captcha This retrieves the 16 top images from the Bing API corresponding to the specified search term. Not all images used in the grid are related to the user's search term. These unrelated images are gathered via Bing API requests using hard-coded bogus search terms.

There is another version of Captcha This that is implemented with a Python programmed microservice that performs the gathering of images via the Bing API. With this version, the app and microservice communicate via socket-connections and exchange JSON-formatted data. The microservice version can be found in this repository's branch "sockets." Currently, this version is not web hosted and can only be run locally. 

## URL
https://captcha-this.ue.r.appspot.com 

## Instructions
In order to play the game, a user must enter a search term, wait for the grid to load, and then select the correct images. 

Image grids are always generated randomlly, however, successive usage of the same search term might yield previous images, because
only the top 16 trending images for a search term are retrieved from the Bing API.
