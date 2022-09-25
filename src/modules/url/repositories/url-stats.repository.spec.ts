import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../data-access/prisma.service';
import {
  createTestingModule,
  mockPrismaClient,
} from '../../../utils/createTestModule';
import { UrlModule } from '../url.module';
import { uuid } from '../../../utils/uuid';
import { mockReset } from 'jest-mock-extended';
import { UrlStatsRepository } from './url-stats.repository';

describe('UrlStatsRepository', () => {
  let provider: UrlStatsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [UrlModule],
    }).compile();

    provider = module.get<UrlStatsRepository>(UrlStatsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    mockReset(mockPrismaClient);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should find all urls ordered by visitCount', async () => {
    await provider.findAll();
    expect(mockPrismaClient.urlStats.findMany).toHaveBeenCalledWith({
      include: {
        url: { select: { longUrl: true, urlCode: true } },
      },
      orderBy: { visitCount: 'desc' },
    });
  });

  it('should find with url id', async () => {
    const id = uuid();
    await provider.findById(id);
    expect(mockPrismaClient.urlStats.findUnique).toHaveBeenCalledWith({
      where: { urlId: id },
    });
  });
});
