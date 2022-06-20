# Captcha_This!

This web app uses a image scraper microservice to dynamically create a 4x4 grid of images (essentially, an image captcha) based on user input.
The microservice used by this web app pulls images from Bing image search. Specifically, the top 15 images from a search query.
Captcha This! and the microservice communicate via sockets. Currently, the web app is set connect with the microserivce at 127.0.0.1:4440.
The web app runs on 127.0.0.1:5000.

In order to play the game, a user must enter a search term, wait for the grid to load, and then select the correct images. 
Image grids are always create randomlly, however, successive search terms of the same value will yield similar images, since
the images being grabbed are always the top 15 images for that search term. 