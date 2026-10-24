import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClientMutationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  recordType: string;

  @IsString()
  @IsNotEmpty()
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  authTag: string;

  @IsString()
  @IsNotEmpty()
  keyFingerprint: string;

  @IsInt()
  version: number;

  @IsBoolean()
  isDeleted: boolean;

  @IsDateString()
  clientCreatedAt: string;

  @IsDateString()
  clientUpdatedAt: string;

  @IsOptional()
  @IsString()
  checksum?: string;
}

export class SyncRequestDto {
  @IsOptional()
  @IsDateString()
  lastSyncTimestamp?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientMutationDto)
  mutations: ClientMutationDto[];

  @IsOptional()
  @IsString()
  clientDeviceId?: string;
}
