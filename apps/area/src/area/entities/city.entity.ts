import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column({ type: 'varchar', nullable: false })
  city_name: string;

  @ManyToOne(() => Province, (Province) => Province.province_id, {
    cascade: true,
  })
  @JoinColumn({ name: 'province_id' })
  province_id: number;
}
