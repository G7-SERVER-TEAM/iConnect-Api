import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { ZipCode } from './zip.entity';

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  district_id: number;

  @Column({ type: 'varchar', nullable: false })
  district_name: string;

  @ManyToOne(() => City, (City) => City.city_id, { cascade: true })
  @JoinColumn({ name: 'city_id' })
  city_id: number;

  @ManyToOne(() => ZipCode, (ZipCode) => ZipCode.zip_id, { cascade: true })
  @JoinColumn({ name: 'zip_id' })
  zip_id: number;
}
