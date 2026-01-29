import { Packr } from 'msgpackr';

const packr = new Packr({ structuredClone: true });

/**
 * Encodes data into a Buffer using MessagePack
 * @param {any} data - The data to encode
 * @returns {Buffer} - The encoded Buffer
 */
export const encode = (data) => {
  return packr.pack(data);
};

/**
 * Decodes MessagePack-encoded data from a Buffer or Uint8Array
 * @param {Buffer | Uint8Array} buffer - The encoded data
 * @returns {any} - The decoded data
 */
export const decode = (buffer) => {
  return packr.unpack(buffer);
};
