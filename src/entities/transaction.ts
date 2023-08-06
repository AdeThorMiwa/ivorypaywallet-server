import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { DecimalTransformer } from '../utils/decimal';
import Decimal from 'decimal.js';
import { TransactionStatus, TransactionType } from '../interfaces/transactions';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  @Generated('uuid')
  uid: string;

  @Column({ enum: Object.keys(TransactionType) })
  type: TransactionType;

  @Column({ enum: Object.keys(TransactionStatus) })
  status: TransactionStatus;

  @ManyToOne(() => User, user => user.transactions)
  from: User;

  @Column({
    type: 'varchar',
    length: 150,
  })
  to: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  amount: Decimal;

  @Column({
    type: 'varchar',
    length: 150,
  })
  note: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
