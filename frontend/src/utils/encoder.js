import { Packr } from 'msgpackr';

const packr = new Packr({ structuredClone: true });

export const encode = (data) => {
  return packr.pack(data);
};

export const decode = (buffer) => {
  return packr.unpack(new Uint8Array(buffer));
};
