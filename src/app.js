// if (typeof (PhusionPassenger) != 'undefined') {
//     PhusionPassenger.configure({ autoInstall: false });
// }
const express = require('express');
const compression = require('compression');
const helmet = require('helmet')
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config');
const mediaServer = require('./mediaServer');
const thumbnailGenerator = require('./cron/thumbnails');
const processRoute = require('./routes/processRoute');
const indexRouter = require('./routes/index');
const stream = require('./routes/streams');
// const rateLimiterMiddleware = require('./helpers/rateLimiter');

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(rateLimiterMiddleware);
app.use(processRoute);

app.use('/api/', indexRouter);
app.use('/streams', stream);
const port = config.server.port;
app.listen(port, () => console.log(`App listening on ${port}!`));
// if (typeof (PhusionPassenger) != 'undefined') {
//     app.listen('passenger');
// } else {
//     const port = config.server.port;
//     app.listen(port, () => console.log(`App listening on ${port}!`));
// }
mediaServer.run();
thumbnailGenerator.start();

module.exports = app;
