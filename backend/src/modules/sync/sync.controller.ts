import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Ip,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SyncService } from './sync.service';
import { SyncRequestDto } from './dto/sync.dto';

@Controller('sync')
@UseGuards(AuthGuard('jwt'))
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('delta')
  async syncDelta(
    @Req() req: any,
    @Body() dto: SyncRequestDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.syncService.processSync(req.user.id, dto, ip, userAgent);
  }
}
