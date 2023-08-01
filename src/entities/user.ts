import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  @Generated('uuid')
  uid: string;

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

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
