# Captcha_This!

Captcha This! is a fun, interactive web that that uses a image scraper microservice to dynamically create a 4x4 grid of images (essentially, an image captcha) based on search term entered by a user.

The microservice used by this web app retrieves image URLs from the Bing Image Search API. 
Captcha This! uses the top 15 images from a search query.

Captcha This! and the microservice communicate via socket-connections. 
Currently, the app is not web hosted and can only be run locally. 
The image scraping microserivce is set to run on 127.0.0.1:4440.
The Captcha This! runs on 127.0.0.1:5000.

In order to play the game, a user must enter a search term, wait for the grid to load, and then select the correct images. 
Image grids are always create randomlly, however, successive search terms of the same value will yield similar images, since
the images being grabbed are always the top 15 images for that search term. 
