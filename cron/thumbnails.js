const CronJob = require('cron').CronJob,
    config = require('../config'),
    port = config.rtmp_server.http.port;
const generateStreamThumbnail = require('../generateStreamThumbnail');
const axios = require('axios');
const job = new CronJob('*/5 * * * * *', function () {
    axios.get('http://127.0.0.1:' + port + '/api/streams').then((response) => {
        const streams = response.data;
        if (typeof (streams['live'] !== undefined)) {
            let live_streams = streams['live'];
            for (let stream in live_streams) {
                if (!live_streams.hasOwnProperty(stream)) continue;
                generateStreamThumbnail(stream);
            }
        }
    }).catch(err => {
        console.log(err);
    });
}, null, true);

module.exports = job;
