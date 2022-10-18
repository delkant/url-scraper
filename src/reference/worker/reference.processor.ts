import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ScraperService } from '../../scraper/services/scraper.service';
import { Reference } from '../entities/reference.entity';
import { ResultService } from '../services/result.service';
import { ReferenceProcess, ReferenceQueue } from '../model/reference.model';
import { v4 as uuidv4 } from 'uuid';

@Processor(ReferenceQueue.REFERENCE_ADDED)
export class ReferenceProcessor {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly resultService: ResultService,
  ) {}

  @Process(ReferenceProcess.FETCH_DATA)
  async handleFetchData(job: Job) {
    const reference: Reference = job.data.reference;
    const jsonData = await this.scraperService.scrape(reference.url);
    await this.resultService.create({
      id: uuidv4(),
      reference,
      data: JSON.stringify(jsonData),
      create_at: new Date(),
    });
  }
}
