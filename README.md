# Captcha This!

Captcha This! is a fun, interactive web app that dynamically creates a grid of images (essentially, an image captcha) based on a user-entered search term.

This version is not currently web hosted and can only be run locally. 
To run locally, Python >= v3.10.5 and Node >= v16.15.1 must be installed. The web app server and microservice server must be started seperately. After successfully starting up both, navigate to 127.0.0.1:5000 in your web browser. 

The microserivce and web app run on 127.0.0.1:4440 and 127.0.0.1:5000, respecfully. 

## Instructions
In order to play the game, a user must enter a search term, wait for the grid to load, and then select the correct images. 

Image captcha are always generated randomlly, however, successive usage of the same search term will yield similar images, because
the images being grabbed are the top 16 images for a search term's search results. 
