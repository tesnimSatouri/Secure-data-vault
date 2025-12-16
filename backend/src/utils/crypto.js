// src/utils/crypto.js
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function getKey() {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) throw new Error('ENCRYPTION_KEY not set');
  const keyBuffer = Buffer.from(keyHex, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error(`Invalid ENCRYPTION_KEY length: ${keyBuffer.length} bytes (expected 32)`);
  }
  return keyBuffer;
}

function encrypt(plainText) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    data: encrypted.toString('base64'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

function decrypt({ data, iv, tag }) {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
