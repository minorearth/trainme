import { SignJWT, jwtVerify } from "jose";
import { AES, enc } from "crypto-js";

const secretKey = process.env.NEXT_DEFAULT_EMAIL;
const key = new TextEncoder().encode(secretKey);
var CryptoJS = require("crypto-js");
var iv = CryptoJS.enc.Hex.parse("79d8a373d47bb25df3c1956b04106b15");

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

// export async function encrypt(payload:string) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("1000 sec from now")
//     .sign(key);
// }

// export async function decrypt(input:string) {
//   const { payload } = await jwtVerify(input, key, {
//     algorithms: ["HS256"],
//   });
//   return payload;
// }
