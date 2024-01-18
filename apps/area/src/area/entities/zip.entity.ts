import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class ZipCode {
  @PrimaryGeneratedColumn()
  zip_id: number;

  @Column({ type: 'varchar', nullable: false })
  zip_code: string;
}
