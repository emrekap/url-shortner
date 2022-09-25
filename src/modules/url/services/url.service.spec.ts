import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../data-access/prisma.service';
import {
  createTestingModule,
  mockPrismaClient,
} from '../../../utils/createTestModule';
import { UrlModule } from '../url.module';
import { UrlService } from './url.service';
import { generateShortCode, uuid } from '../../../utils/uuid';
import { mockReset } from 'jest-mock-extended';
import { UrlStats } from '@prisma/client';

describe('UrlService', () => {
  let provider: UrlService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [UrlModule],
    }).compile();

    provider = module.get<UrlService>(UrlService);
    prismaService = module.get<PrismaService>(PrismaService);
    mockReset(mockPrismaClient);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should get existing url', async () => {
    const mockData = {
      id: uuid(),
      createdAt: new Date(),
      longUrl: 'https://tier.app',
      urlCode: generateShortCode(),
    };
    jest.spyOn(mockPrismaClient.url, 'findUnique').mockResolvedValue(mockData);
    const url = await provider.getUrl(mockData.urlCode);
    expect(mockPrismaClient.url.findUnique).toHaveBeenCalledTimes(1);
    expect(url).toEqual(mockData);
  });

  it('should get stats for all urls', async () => {
    const mockData: UrlStats[] = [
      {
        urlId: uuid(),
        lastVisitedAt: new Date(),
        visitCount: 11,
      },
      {
        urlId: uuid(),
        lastVisitedAt: new Date(),
        visitCount: 110,
      },
    ];
    jest
      .spyOn(mockPrismaClient.urlStats, 'findMany')
      .mockResolvedValue(mockData);
    const stats = await provider.getStatsForAll();
    expect(mockPrismaClient.urlStats.findMany).toHaveBeenCalledTimes(1);
  });

  it('should create a short url', async () => {
    await provider.findOrCreateShortUrl('https://tier.app');
    expect(mockPrismaClient.url.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.url.create).toHaveBeenCalledTimes(1);
  });

  it('should not create a new short url for existing long url', async () => {
    const mockData = {
      id: uuid(),
      createdAt: new Date(),
      longUrl: 'https://tier.app',
      urlCode: generateShortCode(),
    };
    jest.spyOn(mockPrismaClient.url, 'findUnique').mockResolvedValue(mockData);
    jest.spyOn(mockPrismaClient.url, 'create').mockResolvedValue(mockData);

    await provider.findOrCreateShortUrl(mockData.longUrl);

    expect(mockPrismaClient.url.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.url.create).toHaveBeenCalledTimes(0);
  });
});
