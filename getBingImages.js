// Imports
'use strict';
const https = require('https');
const apiCredentials = require('./bingApiKey');

const host = 'api.bing.microsoft.com';
const path = '/v7.0/images/search';

module.exports = {
    getImages: async function(search) {

        return new Promise ((resolve) => {
            let results = [];

            let request_params = {
            method : 'GET',
            hostname : host,
            path : path + '?q=' + encodeURIComponent(search) + '&imageType=Photo&count=16',
            headers : {
            'Ocp-Apim-Subscription-Key' : apiCredentials.key,
            }
            };

            const request = https.request(request_params, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data = data + chunk.toString();
                });
            
                response.on('end', () => {
                    const body = JSON.parse(data);
                    for (const img in body["value"]) {
                        results.push(body["value"][img]["contentUrl"]);
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
