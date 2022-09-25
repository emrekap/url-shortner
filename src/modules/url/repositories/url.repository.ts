import { Injectable } from '@nestjs/common';
import { Uuid } from '../../../utils/uuid';
import { PrismaService } from '../../data-access/prisma.service';

type CreateUrlArgs = {
  id: Uuid;
  longUrl: string;
  urlCode: string;
};

@Injectable()
export class UrlRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public findByUrlCode(urlCode: string) {
    return this.prismaService.url.findUnique({
      where: { urlCode },
    });
  }

  public create(data: CreateUrlArgs) {
    return this.prismaService.url.create({
      data,
    });
  }

  public findByLongUrl(longUrl: string) {
    return this.prismaService.url.findUnique({
      where: {
        longUrl,
      },
    });
  }
}
