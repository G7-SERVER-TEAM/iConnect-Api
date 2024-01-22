import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';
import { City } from './city.entity';
import { Province } from './province.entity';
import { ZipCode } from './zip.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn('increment')
  area_id: number;

  @Column({ type: 'varchar', length: 255 })
  area_name: string;

  @Column({ type: 'varchar', length: 255 })
  house_number: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @ManyToOne(() => District, (District) => District.district_id, {
    cascade: true,
  })
  @JoinColumn({ name: 'district', referencedColumnName: 'district_id' })
  district: number;

  @ManyToOne(() => City, (City) => City.city_id, { cascade: true })
  @JoinColumn({ name: 'city', referencedColumnName: 'city_id' })
  city: number;

  @ManyToOne(() => Province, (Province) => Province.province_id, {
    cascade: true,
  })
  @JoinColumn({ name: 'province', referencedColumnName: 'province_id' })
  province: number;

  @ManyToOne(() => ZipCode, (ZipCode) => ZipCode.zip_id, { cascade: true })
  @JoinColumn({ name: 'zip_code', referencedColumnName: 'zip_id' })
  zip_code: number;
}
