import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../utils/decimal';
import Decimal from 'decimal.js';
import { User } from './user';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', foreignKeyConstraintName: 'walletId' })
  @Generated('uuid')
  uid: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  balance: Decimal;

  @OneToOne(() => User, user => user.wallet)
  user: User;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
