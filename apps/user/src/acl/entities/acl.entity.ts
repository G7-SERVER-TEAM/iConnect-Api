import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Acl {
  @PrimaryGeneratedColumn('increment')
  acl_id: number;

  @Column({ type: 'varchar', length: 30 })
  acl_name: string;
}
