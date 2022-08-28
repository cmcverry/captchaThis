'use strict';

// Imports
const https = require('https');
const { key } = require('./secret')


const host = 'api.bing.microsoft.com';
const path = '/v7.0/images/search';

module.exports = {
    getImages: async function(search) {

        return new Promise ((resolve) => {
            let results = [];
            
            const request_params = {
                method : 'GET',
                hostname : host,
                path : path + '?q=' + encodeURIComponent(search) + '&imageType=Photo&count=16&license=public',
                headers : { 'Ocp-Apim-Subscription-Key' : key, }
            };

            const request = https.request(request_params, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data = data + chunk.toString();
                });
            
                response.on('end', () => {
                    const body = JSON.parse(data);
                    for (const img in body["value"]) {
                        results.push(body["value"][img]["thumbnailUrl"]);
                    }
                    resolve(results)
                });
            })
            
            request.on('error', (error) => {
                console.log('An error', error);
            });
            
            request.end() 
        })
    }
}
