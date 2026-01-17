import { AES, enc } from "crypto-js";

//TODO:(later)secretKey vs iv difference?
const secretKey = process.env.NEXT_PUBLIC_CRYPT;
var CryptoJS = require("crypto-js");

var iv = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_AUTH_DOMAIN);

export function encrypt2(data: Object) {
  return AES.encrypt(JSON.stringify(data), secretKey || "", {
    iv: iv,
  }).toString();
}

export function decrypt2(data: string) {
  var bytes = AES.decrypt(data, secretKey || "", { iv: iv });
  var decryptedData = JSON.parse(bytes.toString(enc.Utf8));
  return decryptedData;
}
