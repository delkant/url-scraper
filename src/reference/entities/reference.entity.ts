import { Result } from './result.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IsUrl, IsUUID } from 'class-validator';

@Entity()
export class Reference {
  @PrimaryColumn()
  @IsUUID('4')
  id: string = uuidv4();

  @Column()
  @IsUrl(undefined, { message: 'Please enter a valid URL' })
  url: string;

  @Column({ type: 'timestamptz' })
  create_at: Date;

  @OneToMany(() => Result, (result) => result.reference)
  results?: Result[];
}
