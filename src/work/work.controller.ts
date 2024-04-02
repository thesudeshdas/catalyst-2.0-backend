import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { WorkDocument } from 'src/schema/work.schema';

import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private workService: WorkService) {}

  @Public()
  @Get('/:userId')
  getAllUserWorks(@Param('userId') userId) {
    return this.workService.getAllUserWorks(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('companyLogo'))
  createWork(
    @Body() createWorkDto,
    @UploadedFile() companyLogo: Express.Multer.File,
  ): Promise<WorkDocument> {
    return this.workService.createWork(createWorkDto, companyLogo);
  }
}
