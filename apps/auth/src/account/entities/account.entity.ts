import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User } from '../../../../user/src/user/entities/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  account_id: number;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'timestamp' })
  last_logged_in: Date;

  @Column({ type: 'json', nullable: false })
  logged_id_history: Date[];

  @Column({ type: 'varchar' })
  access_token: string;

  @OneToOne(() => User, (User) => User.uid, { cascade: true })
  @JoinColumn({ name: 'user', referencedColumnName: 'uid' })
  uid: number;
}
