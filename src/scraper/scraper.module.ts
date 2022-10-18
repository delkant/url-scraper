import { Module } from '@nestjs/common';
import { ScraperService } from './services/scraper.service';

@Module({
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
