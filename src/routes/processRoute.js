const jwt = require('jsonwebtoken');
const { decrypt } = require('../helpers/helper');
const { Logger } = require('../helpers/logger');
const JWT_SECRET = 'NomWqlPsae4L5z0bxHmzW9uZAFr0iCxNavr2VipMnX8';
const { insertOrMerge } = require('@wholelot/storage-db');

const processRoute = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const auth = req.headers.authorization;
            const split = auth.split(' ');
            if (split && split.length > 1) {
                const token = split[1];
                const jToken = jwt.verify(token, JWT_SECRET);
                if (jToken) {
                    if (req.query) {
                        req.query.userName = jToken.id;
                    }
                    if (req.body && Object.keys(req.body).length > 0) {
                        req.body.userName = jToken.id;
                    }
                }
            }
        }
        const clientId = req.headers['x-wl-clientid'];
        if (clientId) {
            if (req.query && !req.query.clientId) {
                req.query.clientId = clientId;
            }
            if (req.body && !req.body.clientId) {
                req.body.clientId = clientId;
            }
        }
        const signature = req.headers['x-wl-signature'];
        const timeStamp = req.headers['x-wl-timestamp'];
        const sessionId = req.headers['x-wl-session'];
        const pageTitle = req.headers['x-wl-page'];

        if (signature && timeStamp) {
            const clientSecret = decrypt(signature, timeStamp);
            if (clientSecret) {
                if (req.query && !req.query.clientSecret) {
                    req.query.clientSecret = clientSecret;
                }
                if (req.body && !req.body.clientSecret) {
                    req.body.clientSecret = clientSecret;
                }
            }
        }
        if (sessionId) {
            const dt = new Date();
            const userInfo = {
                sessionId,
                clientId: clientId,
                rowKey: `${dt.getTime()}`,
                day: dt.getDate(),
                month: dt.getMonth() + 1,
                year: dt.getFullYear(),
                pageTitle,
                query: req.query,
                body: req.body
            };
            await insertOrMerge(userInfo, 'analytics', 'sessionId', 'rowKey', { clientId, clientSecret });
        }
    } catch (error) {
        await Logger.error(error, 'middleware');
    } finally {
        next();
    }
};

module.exports = processRoute;
