import * as t from 'io-ts';
import validator from 'validator';

interface URLStringBrand {
  readonly URLString: unique symbol;
}

export const URLStringCodec = t.brand(
  t.string,
  (raw): raw is t.Branded<string, URLStringBrand> => {
    return validator.isURL(raw) && raw.startsWith('http');
  },
  'URLString',
);

export type URLString = t.TypeOf<typeof URLStringCodec> & string;

export const UrlShortenPayloadCodec = t.type({
  url: URLStringCodec,
});
export type UrlShortenPayload = t.TypeOf<typeof UrlShortenPayloadCodec>;
