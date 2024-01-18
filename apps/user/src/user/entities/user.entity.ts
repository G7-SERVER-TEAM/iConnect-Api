import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Area } from '../../../../area/src/area/entities/area.entity';

/* 
  User Structure
    | uid | role_id | username | password | name | surname | birth_date | email | phone_number | last_logged_in |
*/

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  uid: number;

  @ManyToOne(() => Role, (Role) => Role.id, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role_id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  surname: string;

  @Column({ type: 'timestamp' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  phone_number: string;

  @ManyToOne(() => Area, (Area) => Area.area_id, { cascade: true })
  @JoinColumn({ name: 'area' })
  area: number;
}
