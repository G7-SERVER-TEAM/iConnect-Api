import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Area } from '../../area/entities/area.entity';
import { Status } from '../enum/status.enum';

@Entity()
export class Transaction {
  @PrimaryColumn({ type: 'varchar' })
  transaction_id: string;

  @ManyToOne(() => Area, (Area) => Area.area_id, { cascade: true })
  @JoinColumn({ name: 'area' })
  area_id: number;

  @Column({ type: 'int', name: 'uid', nullable: false })
  uid: number;

  @Column({ type: 'varchar', name: 'license_plate', nullable: false })
  license_plate: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'WAITING', 'FINISH'],
    default: 'ACTIVE',
  })
  status: Status;

  @Column({ type: 'timestamp', name: 'start_time', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', name: 'end_time', nullable: true })
  end_time: Date;
}
