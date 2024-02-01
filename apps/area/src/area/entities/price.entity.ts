import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enum/status.enum';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('increment')
  price_id: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
    nullable: false,
  })
  status: Status;

  @Column({
    type: 'json',
    name: 'before',
    nullable: true,
    default: null,
  })
  before: JSON;

  @Column({
    type: 'json',
    name: 'after',
    nullable: true,
  })
  after: JSON;
}
