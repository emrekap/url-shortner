import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname, '../../../.env'),
});
import { FactoryProvider } from '@nestjs/common';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types';

import { classMaker } from '../../utils/classMaker';
import { tryDecodeCodec } from '../../utils/codecs';

export const Config = classMaker<t.TypeOf<typeof configCodec>>();
export type Config = InstanceType<typeof Config>;

export const configMock: Config = {
  PORT: 3000,
  NODE_ENV: 'test',
  DATABASE_URL: '',
  BASE_URL: '',
  DEFAULT_REDIRECT_URL: '',
};

const configCodec = t.type({
  NODE_ENV: t.union([
    t.literal('production'),
    t.literal('test'),
    t.literal('development'),
    t.literal('staging'),
  ]),
  DATABASE_URL: t.string,
  BASE_URL: t.string,
  DEFAULT_REDIRECT_URL: t.string,
  PORT: NumberFromString,
});

export function useFactory() {
  try {
    if (process.env.LOCAL === 'true') {
      dotenv.config({
        path: path.join(__dirname, '../../../env/.app.env.local'),
      });
    }
    if (process.env.NODE_ENV === 'test') {
      return configMock;
    }
    const config = tryDecodeCodec<Config>(configCodec, process.env);

    return config;
  } catch (error) {
    throw new Error(`Environment not configured properly.`);
  }
}

export const configFactory: FactoryProvider<Config> = {
  provide: Config,
  useFactory,
};
