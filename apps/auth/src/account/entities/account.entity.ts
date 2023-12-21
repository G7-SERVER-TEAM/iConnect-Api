import {
  PrimaryGeneratedColumn,
  Column,
  // OneToOne,
  // JoinColumn,
  Entity,
} from 'typeorm';
// import { User } from '../../../../user/src/user/entities/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  account_id: number;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'timestamp' })
  last_logged_in: Date;

  @Column({ type: 'varchar' })
  access_token: string;

  @Column({ type: 'int' })
  // @OneToOne(() => User, (User) => User.uid, { cascade: true })
  // @JoinColumn({ name: 'uid' })
  uid: number;
}
