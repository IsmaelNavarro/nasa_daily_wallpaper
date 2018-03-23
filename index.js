const wallpaper = require('wallpaper');
const axios = require('axios');
const fs = require('fs');
const sanitize = require("sanitize-filename");
const config = require('./config');

axios.get(`${config.API_ENDPOINT}${config.API_KEY}`)
    .then(response => {
        const { data } = response;
        const title = sanitize(data.title);
        const file = `./wallpapers/${title}.jpg`;

        axios({
            method: 'get',
            url: data.hdurl,
            responseType: 'stream'
        })
            .then(response => {
                response
                    .data
                    .pipe(fs.createWriteStream(file));

                response.data.on('end', function () {
                    wallpaper.set(file).then(() => {
                        console.log('wallpaper changed!');
                    });
                });
            });

    })
    .catch(function (error) {
        console.error(error);
    });


