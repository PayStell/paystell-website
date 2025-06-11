import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class InitiateVerificationDto {
  @IsNotEmpty()
  @IsString()
  @Length(56, 56, { message: 'Stellar wallet address must be exactly 56 characters' })
  @Matches(/^G[A-Z0-9]{55}$/, { 
    message: 'Invalid Stellar wallet address format. Must start with G followed by 55 alphanumeric characters'
  })
  walletAddress: string;
}

export class VerifyWalletDto {
  @IsNotEmpty()
  @IsString()
  @Length(56, 56, { message: 'Stellar wallet address must be exactly 56 characters' })
  @Matches(/^G[A-Z0-9]{55}$/, {
    message: 'Invalid Stellar wallet address format'
  })
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 characters' })
  verificationCode: string;
}
