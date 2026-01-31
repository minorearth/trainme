"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt2 = encrypt2;
exports.decrypt2 = decrypt2;
const crypto_js_1 = require("crypto-js");
//TODO:(later)secretKey vs iv difference?
const secretKey = process.env.NEXT_PUBLIC_CRYPT;
var CryptoJS = require("crypto-js");
var iv = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_AUTH_DOMAIN);
function encrypt2(data) {
    return crypto_js_1.AES.encrypt(JSON.stringify(data), secretKey || "", {
        iv: iv,
    }).toString();
}
function decrypt2(data) {
    var bytes = crypto_js_1.AES.decrypt(data, secretKey || "", { iv: iv });
    var decryptedData = JSON.parse(bytes.toString(crypto_js_1.enc.Utf8));
    return decryptedData;
}
//# sourceMappingURL=encryption.js.map