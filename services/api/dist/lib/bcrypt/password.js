"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const node_crypto_1 = require("node:crypto");
const crypto_1 = require("./crypto");
class Password {
    constructor() {
        this.dkLen = 64;
    }
    async hash(password) {
        const salt = (0, crypto_1.encodeHex)(crypto.getRandomValues(new Uint8Array(16)));
        const key = await this.generateKey(password.normalize('NFKC'), salt);
        return `${salt}:${(0, crypto_1.encodeHex)(key)}`;
    }
    async verify(hash, password) {
        const parts = hash.split(':');
        if (parts.length !== 2)
            return false;
        const [salt, key] = parts;
        const targetKey = await this.generateKey(password.normalize('NFKC'), salt);
        return (0, crypto_1.constantTimeEqual)(targetKey, (0, crypto_1.decodeHex)(key ?? ''));
    }
    async generateKey(data, salt) {
        const textEncoder = new TextEncoder();
        return new Promise((resolve, reject) => {
            (0, node_crypto_1.scrypt)(textEncoder.encode(data), textEncoder.encode(salt), this.dkLen, (error, derivedKey) => {
                if (error)
                    reject(error);
                else
                    resolve(new Uint8Array(derivedKey));
            });
        });
    }
}
exports.Password = Password;
