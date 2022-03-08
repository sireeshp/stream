const NodeMediaServer = require('node-media-server');
const generateStreamThumbnail = require('./generateStreamThumbnail');
const config = require('./config');

nms = new NodeMediaServer(config.rtmp_server);

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    generateStreamThumbnail(stream_key);
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;