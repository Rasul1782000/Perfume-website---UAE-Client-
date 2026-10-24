import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsInt, Min } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10, { message: 'Password must be at least 10 characters long for HIPAA compliance' })
  password: string;

  /**
   * 32-byte Base64 client-side salt used for PBKDF2 Master Key derivation.
   */
  @IsString()
  keyDerivationSalt: string;

  @IsOptional()
  @IsInt()
  @Min(100000)
  pbkdf2Rounds?: number;

  @IsOptional()
  @IsString()
  masterKeyFingerprint?: string;

  @IsOptional()
  @IsString()
  encryptedKeyBackup?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  clientDeviceId?: string;
}

export class KeyBackupUpdateDto {
  @IsString()
  encryptedKeyBackup: string;

  @IsString()
  masterKeyFingerprint: string;
}
