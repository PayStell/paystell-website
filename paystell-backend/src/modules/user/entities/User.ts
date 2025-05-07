import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WalletVerification } from '../../wallet/entities/WalletVerification';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'wallet_address', nullable: true, length: 56 })
  walletAddress: string;

  @Column({ name: 'is_wallet_verified', default: false })
  isWalletVerified: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WalletVerification, walletVerification => walletVerification.user)
  walletVerifications: WalletVerification[];
}