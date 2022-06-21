# Captcha This!

Captcha This! is a fun, interactive web app that dynamically creates a grid of images (essentially, an image captcha) based on a user-entered search term.

Captcha This! is deployed on the Google App Engine Platform and uses the Bing Image Search API for gathering image URLs.
From an image search via the Bing API, Captcha This! retrieves the 16 images from the top search results. Not all images used in the captcha are related to the user's search term. These unrelated images are to be gathered with program-supplied bogus search terms. 

## URL
https://captcha-this.ue.r.appspot.com 

## Instructions
In order to play the game, a user must enter a search term, wait for the grid to load, and then select the correct images. 

Image captcha are always generated randomlly, however, successive usage of the same search term will yield similar images, because
the images being grabbed are the top 16 images for a search term's search results. 
