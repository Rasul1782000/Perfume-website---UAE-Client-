import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto, ip?: string, userAgent?: string) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    // Hash password with Argon2id using recommended memory and iteration parameters
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      keyDerivationSalt: dto.keyDerivationSalt,
      pbkdf2Rounds: dto.pbkdf2Rounds || 600000,
      masterKeyFingerprint: dto.masterKeyFingerprint || '',
      encryptedKeyBackup: dto.encryptedKeyBackup || null,
    });

    const savedUser = await this.userRepo.save(user);

    await this.auditService.logEvent({
      userId: savedUser.id,
      action: 'AUTH_REGISTER',
      ipAddress: ip,
      userAgent,
      metadata: {
        pbkdf2Rounds: savedUser.pbkdf2Rounds,
        hasKeyBackup: !!savedUser.encryptedKeyBackup,
      },
    });

    const token = this.jwtService.sign({ sub: savedUser.id, email: savedUser.email });

    return {
      accessToken: token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        keyDerivationSalt: savedUser.keyDerivationSalt,
        pbkdf2Rounds: savedUser.pbkdf2Rounds,
        masterKeyFingerprint: savedUser.masterKeyFingerprint,
        encryptedKeyBackup: savedUser.encryptedKeyBackup,
      },
    };
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.password);
    if (!isMatch) {
      await this.auditService.logEvent({
        userId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        clientDeviceId: dto.clientDeviceId,
        ipAddress: ip,
        userAgent,
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.auditService.logEvent({
      userId: user.id,
      action: 'AUTH_LOGIN_SUCCESS',
      clientDeviceId: dto.clientDeviceId,
      ipAddress: ip,
      userAgent,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        keyDerivationSalt: user.keyDerivationSalt,
        pbkdf2Rounds: user.pbkdf2Rounds,
        masterKeyFingerprint: user.masterKeyFingerprint,
        encryptedKeyBackup: user.encryptedKeyBackup,
      },
    };
  }

  async updateKeyBackup(userId: string, encryptedKeyBackup: string, masterKeyFingerprint: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.encryptedKeyBackup = encryptedKeyBackup;
    user.masterKeyFingerprint = masterKeyFingerprint;
    await this.userRepo.save(user);

    await this.auditService.logEvent({
      userId,
      action: 'KEY_BACKUP_UPDATED',
      metadata: { masterKeyFingerprint },
    });

    return { success: true };
  }
}
