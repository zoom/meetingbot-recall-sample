import crypto from 'crypto';
import createError from 'http-errors';
import { zoomApp } from '../config.js';

/**
 * Decode and parse a base64 encoded Zoom App Context
 * @param {String} ctx - Encoded Zoom App Context
 * @return {Object} Decoded Zoom App Context object
 */
function unpack(ctx) {
    // Decode base64
    let buf = Buffer.from(ctx, 'base64');

    // Get iv length (1 byte)
    const ivLength = buf.readUInt8();
    buf = buf.slice(1);

    // Get iv
    const iv = buf.slice(0, ivLength);
    buf = buf.slice(ivLength);

    // Get aad length (2 bytes)
    const aadLength = buf.readUInt16LE();
    buf = buf.slice(2);

    // Get aad
    const aad = buf.slice(0, aadLength);
    buf = buf.slice(aadLength);

    // Get cipher length (4 bytes)
    const cipherLength = buf.readInt32LE();
    buf = buf.slice(4);

    // Get cipherText
    const cipherText = buf.slice(0, cipherLength);

    // Get tag
    const tag = buf.slice(cipherLength);

    return {
        iv,
        aad,
        cipherText,
        tag,
    };
}

/**
 * Decrypts cipherText from a decoded Zoom App Context object
 * @param {Buffer} cipherText - Data to decrypt
 * @param {Buffer} hash - sha256 hash of the Client Secret
 * @param {Buffer} iv - Initialization Vector for cipherText
 * @param {Buffer} aad - Additional Auth Data for cipher
 * @param {Buffer} tag - cipherText auth tag
 * @return {JSON|Error} Decrypted JSON obj from cipherText or Error
 */
function decrypt(cipherText, hash, iv, aad, tag) {
    // AES/GCM decryption
    const decipher = crypto
        .createDecipheriv('aes-256-gcm', hash, iv)
        .setAAD(aad)
        .setAuthTag(tag)
        .setAutoPadding(false);

    const update = decipher.update(cipherText, 'hex', 'utf-8');
    const final = decipher.final('utf-8');

    const decrypted = update + final;

    return JSON.parse(decrypted);
}

/**
 * Decodes, parses and decrypts the x-zoom-app-context header
 * @see https://marketplace.zoom.us/docs/beta-docs/zoom-apps/zoomappcontext#decrypting-the-header-value
 * @param {String} header - Encoded Zoom App Context header
 * @param {String} [secret=''] - Client Secret for the Zoom App
 * @return {JSON|Error} Decrypted Zoom App Context or Error
 */
export function getAppContext(header, secret = '') {
    if (!header || typeof header !== 'string')
        throw createError(500, 'context header must be a valid string');

    const key = secret || zoomApp.clientSecret;

    // Decode and parse context
    const { iv, aad, cipherText, tag } = unpack(header);

    // Create sha256 hash from Client Secret (key)
    const hash = crypto.createHash('sha256').update(key).digest();

    // return decrypted context
    return decrypt(cipherText, hash, iv, aad, tag);
}

export const contextHeader = 'x-zoom-app-context';
