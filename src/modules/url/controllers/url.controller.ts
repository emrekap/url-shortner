import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Config } from '../../config/config-factory';
import { tryDecodeCodec } from '../../../utils/codecs';
import { CodecError, MissingArgError } from '../../../utils/error-types';

import {
  UrlShortenPayload,
  UrlShortenPayloadCodec,
} from '../../../utils/types';
import { UrlService } from '../services/url.service';

@Controller('')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly config: Config,
  ) {}

  @Get('urls')
  async urls(@Res() res: Response) {
    try {
      const urls = await this.urlService.getStatsForAll();
      res.json({
        success: true,
        data: urls.map((u) => {
          return { ...u, shortUrl: `${this.config.BASE_URL}${u.url.urlCode}` };
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('url/shorten')
  async urlShorten(@Body() body: unknown, @Res() res: Response) {
    try {
      const decoded = tryDecodeCodec<UrlShortenPayload>(
        UrlShortenPayloadCodec,
        body,
      );
      let url = await this.urlService.findOrCreateShortUrl(decoded.url);
      res.json({
        success: true,
        data: {
          shortUrl: `${this.config.BASE_URL}${url.urlCode}`,
        },
      });
    } catch (error) {
      if (error instanceof CodecError) {
        throw new BadRequestException({
          error: error.externalMessage,
          fields: error.fields,
        });
      }
      throw error;
    }
  }

  @Get('/:shortId')
  async redirect(@Param('shortId') shortId: string, @Res() res: Response) {
    console.log('redirect shortId: ', shortId);
    try {
      if (!shortId) throw new MissingArgError('shortId');
      const url = await this.urlService.getUrl(shortId);
      if (url) {
        await this.urlService.incrementVisitCount(url.id);
        res.redirect(url.longUrl);
      } else {
        res.redirect(this.config.DEFAULT_REDIRECT_URL);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
      });
    }
  }
}
