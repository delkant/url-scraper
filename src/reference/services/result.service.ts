import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResultDto } from '../dto/create-result.dto';
import { Result } from '../entities/result.entity';
import { ResultPage } from '../model/reference.model';

@Injectable()
export class ResultService {
  constructor(@InjectRepository(Result) private resultRepo) {}

  create(createResultDto: CreateResultDto) {
    const newResult = this.resultRepo.save({
      ...createResultDto,
    });
    return newResult;
  }

  async findAllByRefId(
    id: string,
    page?: number,
    size?: number,
  ): Promise<ResultPage> {
    size = size || 10;
    page = page || 1;

    const [result, total] = await this.resultRepo.findAndCount({
      relations: ['reference'],
      where: {
        reference: {
          id,
        },
      },
      order: {
        create_at: 'DESC',
      },
      skip: (page - 1) * size,
      take: size,
    });
    Logger.debug(`Results for reference_id-> ${id} (total: ${total})`);
    return { result, total, page, size };
  }

  remove(id: string) {
    const result = this.resultRepo.findOneBy(id);
    return this.resultRepo.remove(result);
  }
}
