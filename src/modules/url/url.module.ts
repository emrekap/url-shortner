import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DataAccessModule } from '../data-access/data-access.module';
import { UrlController } from './controllers/url.controller';
import { UrlStatsRepository } from './repositories/url-stats.repository';
import { UrlRepository } from './repositories/url.repository';
import { UrlService } from './services/url.service';

@Module({
  imports: [ConfigModule, DataAccessModule],
  providers: [UrlService, UrlRepository, UrlStatsRepository],
  controllers: [UrlController],
})
export class UrlModule {}
