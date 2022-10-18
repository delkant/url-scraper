import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ReferenceService } from './services/reference.service';
import { ReferenceController } from './controllers/reference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { ReferenceQueue } from './model/reference.model';
import { ReferenceProcessor } from './worker/reference.processor';
import { ResultService } from './services/result.service';
import { ScraperModule } from '../scraper/scraper.module';
import { Result } from './entities/result.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Reference, Result]),
    BullModule.registerQueue({
      name: ReferenceQueue.REFERENCE_ADDED,
    }),
    ScraperModule,
  ],
  controllers: [ReferenceController],
  providers: [ReferenceService, ResultService, ReferenceProcessor],
})
export class ReferenceModule {}
