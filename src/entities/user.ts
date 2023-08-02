import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet';
import { Transaction } from './transaction';
import { UserStatus, UserType } from '../interfaces';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  @Generated('uuid')
  uid: string;

  @Column({ enum: Object.keys(UserType), default: UserType.USER })
  userType: UserType;

  @Column({ enum: Object.keys(UserStatus), default: UserStatus.INACTIVE })
  status: UserStatus;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  avatar: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  password: string;

  @OneToOne(() => Wallet, wallet => wallet.user, { cascade: true })
  @JoinColumn({ foreignKeyConstraintName: 'walletId' })
  wallet: Wallet;

  @OneToMany(() => Transaction, transaction => transaction.from)
  transactions: Transaction[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
