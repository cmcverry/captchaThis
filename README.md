# Captcha This

Captcha This randomly generates a grid of images (essentially, an image captcha) corresponding to a user-entered search term.

Captcha This is deployed on Google App Engine and uses the Bing Image Search API for gathering image URLs. Captcha This retrieves the 16 top images from the Bing API corresponding to the specified search term. Not all images used in the grid are related to the user's search term. These unrelated images are gathered via Bing API requests using hard-coded search terms and previous search terms entered by users. Previous used image URLs are cached, which decreases the amount of requests made to the API.

## Instructions
In order to play the game, a user must enter a search term, wait for the grid to load, click the correct images, and click the solve button. 

Image grids are always generated randomlly, however, successive usage of the same search term might yield previous images, because
only the top 16 trending images for a search term are retrieved from the Bing API.
