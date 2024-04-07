import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { User } from '../../../../user/src/user/entities/user.entity';
import { Status } from '../enum/status.enum';

@Entity()
export class Payment {
  @PrimaryColumn()
  payment_id: string;

  @Column({ type: 'varchar', nullable: false, name: 'price' })
  total_price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.WAITING,
  })
  status: Status;

  @Column({ type: 'timestamp', name: 'date', nullable: true })
  date: Date;

  @ManyToOne(() => User, (User) => User.uid, { cascade: true })
  @JoinColumn({ name: 'uid' })
  uid: number;

  @OneToOne(() => Transaction, (Transaction) => Transaction.transaction_id, {
    cascade: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction_id: string;
}
