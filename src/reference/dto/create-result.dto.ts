import { IsJSON, IsUUID } from 'class-validator';
import { Reference } from '../entities/reference.entity';

export class CreateResultDto {
  @IsUUID('4')
  id: string;
  reference: Reference;
  create_at: Date;
  @IsJSON()
  data: string;
}
