import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 30 })
  role_name: string;

  @Column('json')
  acls: JSON;
}
