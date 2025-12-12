"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = exports.updatedAt = exports.createdAt = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const node_crypto_1 = require("node:crypto");
exports.createdAt = (0, mysql_core_1.timestamp)({ mode: 'date' })
    .defaultNow()
    .notNull();
exports.updatedAt = (0, mysql_core_1.timestamp)({ mode: 'date' })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull();
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const bufToBigInt = (buf) => {
    let v = 0n;
    for (const i of buf)
        v = (v << 8n) + BigInt(i);
    return v;
};
const randomLetter = () => {
    const idx = Number((0, node_crypto_1.randomBytes)(1)[0]) % alphabet.length;
    return alphabet[idx];
};
const createEntropy = (len = 24) => {
    return (0, node_crypto_1.randomBytes)(len)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, len);
};
const hash = (input) => {
    const hashBuf = (0, node_crypto_1.createHash)('sha3-512').update(input).digest();
    return bufToBigInt(hashBuf).toString(36);
};
const createId = () => {
    const time = Date.now().toString(36);
    const salt = createEntropy(24);
    const hashInput = time + salt;
    return `${randomLetter()}${hash(hashInput).substring(1, 24)}`;
};
exports.createId = createId;
