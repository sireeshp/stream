const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const encrypt = (text, secret = secretKey) => {
    return AES.encrypt(text, secret).toString();
};

const decrypt = (hash, secret = secretKey) => {
    const bytes = AES.decrypt(hash, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

const getStringToCamel = (str) => {
    if (!str) {
        return '';
    }
    const replaceStr = str.trim().replace(/[^a-zA-Z ]/g, '');
    return replaceStr.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) {
            return ''; // or if (/\s+/.test(match)) for white spaces
        }
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

module.exports = {
    encrypt,
    decrypt,
    getStringToCamel
};