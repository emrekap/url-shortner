import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../modules/data-access/prisma.service';
import { generateShortCode, Uuid, uuid } from '../../../utils/uuid';
import { UrlStatsRepository } from '../repositories/url-stats.repository';
import { UrlRepository } from '../repositories/url.repository';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlStatsRepository: UrlStatsRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async getUrl(urlCode: string) {
    try {
      return this.urlRepository.findByUrlCode(urlCode);
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateShortUrl(longUrl: string) {
    try {
      let url = await this.getByLongUrl(longUrl);
      if (!url) {
        url = await this.createShortUrl(longUrl);
      }
      return url;
    } catch (error) {
      throw error;
    }
  }

  private async getByLongUrl(longUrl: string) {
    try {
      return this.urlRepository.findByLongUrl(longUrl);
    } catch (error) {
      throw error;
    }
  }

  async getStatsForAll() {
    return this.urlStatsRepository.findAll();
  }

  private async createShortUrl(longUrl: string) {
    try {
      const urlData = {
        id: uuid(),
        longUrl,
        urlCode: generateShortCode(),
      };
      const [url] = await Promise.all([
        this.urlRepository.create(urlData),
        this.urlStatsRepository.create(urlData.id),
      ]);
      return url;
    } catch (error) {
      throw error;
    }
  }

  incrementVisitCount(urlId: string) {
    return this.urlStatsRepository.incrementVisitCount(urlId);
  }
}
