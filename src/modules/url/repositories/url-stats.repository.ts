import { Injectable } from '@nestjs/common';
import { UrlStats } from '@prisma/client';
import { PrismaService } from '../../data-access/prisma.service';

export type UrlWithStats = UrlStats & {
  url: {
    longUrl: string;
    urlCode: string;
  };
};
@Injectable()
export class UrlStatsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public findAll() {
    return this.prismaService.urlStats.findMany({
      include: {
        url: { select: { longUrl: true, urlCode: true } },
      },
      orderBy: {
        visitCount: 'desc',
      },
    });
  }

  public findById(urlId: string) {
    return this.prismaService.urlStats.findUnique({
      where: { urlId },
    });
  }

  public create(urlId: string) {
    return this.prismaService.urlStats.create({
      data: {
        urlId,
      },
    });
  }

  public incrementVisitCount(urlId: string) {
    return this.prismaService.urlStats.update({
      data: {
        lastVisitedAt: new Date(),
        visitCount: { increment: 1 },
      },
      where: {
        urlId,
      },
    });
  }
}
