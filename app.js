const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const app = express();
const mediaServer = require('./mediaServer');
const thumbnailGenerator = require('./cron/thumbnails');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
port = config.server.port;
app.use('/', require('./routes/index'));
app.use('/streams', require('./routes/streams'));
app.listen(port, () => console.log(`App listening on ${port}!`));

mediaServer.run();
thumbnailGenerator.start();

module.exports = app;
