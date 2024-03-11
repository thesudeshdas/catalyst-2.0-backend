import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkDocument } from 'src/schema/work.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('work')
export class WorkController {
  constructor(private workService: WorkService) {}

  @Post()
  @UseInterceptors(FileInterceptor('companyLogo'))
  createWork(
    @Body() createWorkDto,
    @UploadedFile() companyLogo: Express.Multer.File,
  ): Promise<WorkDocument> {
    return this.workService.createWork(createWorkDto, companyLogo);
  }
}
