const { get, insertOrMerge } = require('@wholelot/storage-db/index');
const convertToUTCTimeStamp = (dt) => {
    let utcMonth = dt.getUTCMonth() + 1;
    if (utcMonth < 10) {
        utcMonth = '0' + utcMonth;
    }
    let utcDate = dt.getUTCDate();
    if (utcDate < 10) {
        utcDate = '0' + utcDate;
    }

    let utcHour = dt.getUTCHours();
    if (utcHour < 10) {
        utcHour = '0' + utcHour;
    }
    let utcMin = dt.getUTCMinutes();
    if (utcMin < 10) {
        utcMin = '0' + utcMin;
    }
    let utcSec = dt.getUTCSeconds();
    if (utcSec < 10) {
        utcSec = '0' + utcSec;
    }

    let utcMS = dt.getUTCMilliseconds();
    if (utcMS < 10) {
        utcMS = '0' + utcMS;
    }

    return dt.getUTCFullYear() + '-' + utcMonth + '-' + utcDate + 'T' + utcHour + ':' + utcMin + ':' + utcSec + '.' + utcMS + 'Z';
};
const Logger = {
    info: async (msg, methodName, dbId) => {
        await addLog(msg, 'info', methodName, dbId);
    },
    error: async (msg, methodName, dbId) => {
        await addLog(msg, 'error', methodName, dbId);
    },
    log: async (msg, methodName, dbId) => {
        await addLog(msg, 'info', methodName, dbId);
    },
    axiosError: async (error, methodName, dbId) => {
        let errorMessage = '';
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = error.response;

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            errorMessage = error.request;

        } else {
            // Something happened in setting up the request that triggered an Error
            errorMessage = error.message;
        }
        await addLog(errorMessage, 'error', methodName, dbId);
    }
};

const addLog = async (msg, type, methodName, dbId) => {
    try {
        const env = process.env.NODE_ENV || 'development';
        if (env !== 'development') {
            const obj = { type, appName: 'Generic', rKey: `${new Date().getTime()}`, methodName, message: msg, env, dbId };
            await insertOrMerge(obj, 'appLogger', 'appName', 'rKey', dbId);
        } else {
            console.log(methodName, msg);
        }
    } catch (error) {
        console.log(error);
    }
};

const getLogInfo = (token, from = addDays(-1)) => {
    const ft = convertToUTCTimeStamp(new Date(from));
    const filter = `PartitionKey eq 'Generic' and timestamp ge datetime'${ft}'`;
    return get('appLogger', 'appName', 'rKey', filter, token);
};

const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

module.exports = { Logger, getLogInfo };
