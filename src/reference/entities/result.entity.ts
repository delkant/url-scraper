import { Reference } from './reference.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Result {
  @PrimaryColumn()
  id: string = uuidv4();

  @ManyToOne(() => Reference, (reference) => reference.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reference_id' })
  reference: Reference;

  @Column({ type: 'timestamptz' })
  create_at: Date;

  @Column('jsonb', { nullable: false, default: {} })
  data: object;
}
