import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from './area.entity';
import { Status } from '../enum/status.enum';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('increment')
  price_id: number;

  @ManyToOne(() => Area, (Area) => Area.area_id, { cascade: true })
  @JoinColumn({ name: 'area_id', referencedColumnName: 'area_id' })
  area_id: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
    nullable: false,
  })
  status: Status;

  @Column({
    type: 'timestamp',
    name: 'start_time',
    nullable: false,
  })
  start_time: Date;

  @Column({
    type: 'json',
    name: 'configuration',
    nullable: false,
  })
  configuration: JSON;
}
