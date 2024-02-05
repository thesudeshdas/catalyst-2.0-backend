import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PowstService } from './powst.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PowstDocument } from 'src/schema/powst.schema';

@Controller('powst')
export class PowstController {
  constructor(private powstService: PowstService) {}

  @Get()
  getAllPowst() {
    return this.powstService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPowst(
    @Body() createPowstDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PowstDocument> {
    return this.powstService.create(createPowstDto, image);
  }
}

// TODO @thesudeshdas => Create the validation for create powst
