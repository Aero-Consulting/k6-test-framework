import crypto from "k6/crypto";
import encoding from "k6/encoding";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const algToHash = {
  HS256: "sha256",
  HS384: "sha384",
  HS512: "sha512"
};

function sign(data, hashAlg, secret) {
  let hasher = crypto.createHMAC(hashAlg, secret);
  hasher.update(data);
  return hasher.digest("base64").replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}

function encode(payload, secret, algorithm) {
  algorithm = algorithm || "HS256";
  let header = encoding.b64encode(JSON.stringify({ typ: "JWT", alg: algorithm }), "rawurl");
  payload = encoding.b64encode(JSON.stringify(payload), "rawurl");
  let sig = sign(header + "." + payload, algToHash[algorithm], secret);
  return [header, payload, sig].join(".");
}

export function anonymousJWT() {
  const randomUUID = uuidv4();

  let message = {
    phone: null,
    is_employee: false,
    client_id: randomUUID,
    exp: 2543228604
  };
  let token = encode(message, __ENV.AUTH_SERVER_SECRET || "67be3a03621f50e73d48a25275780296ac734e4912cc47d3c6185ae08e559a72");
  return token;
}
