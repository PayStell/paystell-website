import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/User';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  FAILED = 'failed'
}

@Entity('wallet_verifications')
export class WalletVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'wallet_address', length: 56 })
  walletAddress: string;

  @Column({ name: 'verification_token', length: 64, nullable: true })
  verificationToken: string;

  @Column({ name: 'verification_code', length: 6, nullable: true })
  verificationCode: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING
  })
  status: VerificationStatus;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'verification_attempts', default: 0 })
  verificationAttempts: number;

  @Column({ name: 'last_attempt_at', nullable: true })
  lastAttemptAt: Date;
}