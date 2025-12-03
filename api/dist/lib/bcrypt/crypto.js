"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantTimeEqual = constantTimeEqual;
exports.decodeHex = decodeHex;
exports.encodeHex = encodeHex;
exports.generateStateOrCode = generateStateOrCode;
exports.generateCodeChallenge = generateCodeChallenge;
exports.generateSecureString = generateSecureString;
exports.hashSecret = hashSecret;
function generateSecureString() {
    const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789';
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    let id = '';
    for (const b of bytes)
        id += alphabet[b >> 3] ?? '';
    return id;
}
function generateStateOrCode() {
    const randomValues = new Uint8Array(32);
    crypto.getRandomValues(randomValues);
    return btoa(String.fromCharCode(...randomValues))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
async function hashSecret(secret) {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
    return new Uint8Array(secretHashBuffer);
}
function encodeHex(bytes) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function decodeHex(hex) {
    if (hex.length % 2 !== 0)
        throw new Error('Invalid hex string');
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2)
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    return bytes;
}
function constantTimeEqual(a, b) {
    if (a.byteLength !== b.byteLength)
        return false;
    let c = 0;
    for (let i = 0; i < a.byteLength; i++)
        c |= a[i] ^ b[i];
    return c === 0;
}
