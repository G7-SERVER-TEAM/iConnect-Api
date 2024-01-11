import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  province_id: number;

  @Column({ type: 'varchar', nullable: false })
  province_name: string;
}
