import { Injectable, Logger } from '@nestjs/common';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { Reference } from '../entities/reference.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReferenceQueue, ReferenceProcess } from '../model/reference.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference) private referenceRepo,
    @InjectQueue(ReferenceQueue.REFERENCE_ADDED)
    private readonly referenceQueue: Queue,
  ) {}

  async create(createReferenceDto: CreateReferenceDto) {
    const reference = await this.getOrCreateByUrl(createReferenceDto.url);
    await this.queueFetchData(reference);
    return reference;
  }

  async queueFetchData(reference: Reference) {
    await this.referenceQueue.add(ReferenceProcess.FETCH_DATA, {
      reference,
    });
  }

  findOne(id: string) {
    return this.referenceRepo.findOneBy({ id });
  }

  async getOrCreateByUrl(url: string) {
    const reference = await this.referenceRepo.findOneBy({
      url,
    });
    if (reference) {
      return reference;
    }

    const newReference: Reference = await this.referenceRepo.save({
      id: uuidv4(),
      url,
      create_at: new Date(),
    });
    return newReference;
  }
  remove(id: string) {
    const reference = this.findOne(id);
    return this.referenceRepo.remove(reference);
  }

  //@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  /**
   * Getting latest results group by reference
   * not older than 48 hours every 24hs
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async monitorRefereceChanges() {
    Logger.debug(`Cron-> Fetch data`);
    const query = this.referenceRepo.createQueryBuilder('res');
    const references: Reference[] = await query
      .where(
        'res.id IN( ' +
          ' SELECT reference_id FROM result r ' +
          ' WHERE r.create_at = ( ' +
          '                      SELECT MAX(r2.create_at) FROM result r2 ' +
          '                      WHERE r.reference_id  = r2.reference_id' +
          "                      AND r2.create_at BETWEEN NOW() - INTERVAL '48 HOURS' " +
          '                      AND NOW() ' +
          '                     ) ' +
          ' ORDER BY reference_id, create_at' +
          '       )',
      )
      .getMany();
    references.forEach((r) => this.queueFetchData(r));
  }
}
