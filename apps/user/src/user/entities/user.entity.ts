import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/* 
  User Structure
    | uid | role_id | username | password | name | surname | birth_date | email | phone_number | last_logged_in |
*/

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  uid: number;

  @Column({ type: 'int', name: 'role_id', nullable: false })
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

  @Column({ type: 'int', name: 'area', nullable: true })
  area: number;
}
