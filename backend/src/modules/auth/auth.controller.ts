import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Ip,
  Headers,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, KeyBackupUpdateDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.register(dto, ip, userAgent);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(dto, ip, userAgent);
  }

  @Patch('key-backup')
  @UseGuards(AuthGuard('jwt'))
  async updateKeyBackup(@Req() req: any, @Body() dto: KeyBackupUpdateDto) {
    return this.authService.updateKeyBackup(
      req.user.id,
      dto.encryptedKeyBackup,
      dto.masterKeyFingerprint,
    );
  }
}
