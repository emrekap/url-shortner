import { CodecError } from './error-types';

export const tryDecodeCodec = <T>(codec: any, data: any) => {
  const decoded = codec.decode(data);

  if (decoded._tag === 'Left') {
    const fields: string[] = [];
    decoded.left.forEach((validationError: any, index: any) => {
      const keysList = validationError.context
        .filter((x) => x.key !== '')
        .map((v: any) => v.key);
      const key = keysList.join(' > ');
      fields.push(key);
      if (process.env.NODE_ENV === 'development') {
        console.error(`Index: ${index}, Key: ${key}`);
      }
    });
    throw new CodecError(fields);
  }
  return decoded.right as T;
};
