import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../utils/error-handling';
import { ConfigModule } from './config/config.module';
import { DataAccessModule } from './data-access/data-access.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [ConfigModule, DataAccessModule, UrlModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
