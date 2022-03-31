const NodeMediaServer = require('node-media-server');
const generateStreamThumbnail = require('./thumbnail');
const config = require('./config');
const { get } = require('@wholelot/storage-db');
const clientId = 'digitalself';
const clientSecret = '1627930257819';

const nms = new NodeMediaServer(config.rtmp_server);

nms.on('prePublish', async (id, StreamPath, args) => {
    const stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // try {
    //     const qry = `RowKey eq '${stream_key}'`;
    //     const response = await get('steamingKeys', 'userName', 'streamingKey', qry, 1, null, { clientId, clientSecret });
    //     if (response && response.results && response.results.length) {
    //         const session = nms.getSession(id);
    //         session.reject();
    //     } else {
    //         generateStreamThumbnail(stream_key);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    generateStreamThumbnail(stream_key);
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;