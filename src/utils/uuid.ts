import { v4, validate } from 'uuid';
import * as t from 'io-ts';
import { customAlphabet } from 'nanoid';

interface UuidBrand {
  readonly Uuid: unique symbol;
}

export const UuidCodec = t.brand(
  t.string,
  (raw): raw is t.Branded<string, UuidBrand> => {
    return validate(raw);
  },
  'Uuid',
);

export type Uuid = t.TypeOf<typeof UuidCodec>;

export const uuid = (): Uuid => {
  return v4() as Uuid;
};

export const generateShortCode = (size = 12) => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  return customAlphabet(alphabet, size)();
};
