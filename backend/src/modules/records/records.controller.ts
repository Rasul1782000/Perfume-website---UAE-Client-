import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecordsService } from './records.service';

@Controller('records')
@UseGuards(AuthGuard('jwt'))
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  async getRecords(
    @Req() req: any,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.recordsService.findAllForUser(
      req.user.id,
      includeDeleted === 'true',
    );
  }

  @Get(':id')
  async getRecord(@Req() req: any, @Param('id') id: string) {
    return this.recordsService.findOneForUser(req.user.id, id);
  }

  @Delete(':id')
  async deleteRecord(@Req() req: any, @Param('id') id: string) {
    return this.recordsService.deleteForUser(req.user.id, id);
  }
}
