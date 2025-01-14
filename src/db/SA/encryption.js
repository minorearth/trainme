// "use server";
import { SignJWT, jwtVerify } from "jose";
import { AES, enc } from "crypto-js";

const secretKey = process.env.FIREBASE_PRIVATE_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1000 sec from now")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

var CryptoJS = require("crypto-js");
var iv = CryptoJS.enc.Hex.parse("79d8a373d47bb25df3c1956b04106b15");

export function encrypt2(data) {
  return AES.encrypt(JSON.stringify(data), key, { iv: iv }).toString();
}

export function decrypt2(data) {
  console.log("asdasd", data);
  var bytes = AES.decrypt(data, key, { iv: iv });
  var decryptedData = JSON.parse(bytes.toString(enc.Utf8));
  return decryptedData;
}
