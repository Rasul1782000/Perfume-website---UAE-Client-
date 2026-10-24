import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { RecordsModule } from './modules/records/records.module';
import { SyncModule } from './modules/sync/sync.module';
import { AuditModule } from './modules/audit/audit.module';
import { User } from './modules/auth/entities/user.entity';
import { EncryptedRecord } from './modules/records/entities/encrypted-record.entity';
import { AuditLog } from './modules/audit/entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'vaultmed_admin',
      password: process.env.DB_PASSWORD || 'secure_dev_password_change_in_prod',
      database: process.env.DB_NAME || 'vaultmed_db',
      entities: [User, EncryptedRecord, AuditLog],
      synchronize: process.env.NODE_ENV !== 'production', // Use migrations for production
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    RecordsModule,
    SyncModule,
    AuditModule,
  ],
})
export class AppModule {}
