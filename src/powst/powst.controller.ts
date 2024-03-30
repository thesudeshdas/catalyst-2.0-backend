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
import { PowstDocument } from 'src/schema/powst.schema';

import { PowstService } from './powst.service';

@Controller('powst')
export class PowstController {
  constructor(private powstService: PowstService) {}

  @Public()
  @Get()
  getAllPowst() {
    return this.powstService.findAll();
  }

  @Public()
  @Get('/:powstId')
  getPowstDetails(@Param('powstId') powstId: string): Promise<PowstDocument> {
    return this.powstService.findById(powstId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPowst(
    @Body() createPowstDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PowstDocument> {
    return this.powstService.create(createPowstDto, image);
  }

  @Public()
  @Post('/:powstId/like')
  likePowst(@Param('powstId') powstId: string, @Body('userId') userId: string) {
    return this.powstService.likePowst(powstId, userId);
  }

  @Public()
  @Post('/:powstId/unlike')
  unlikePowst(
    @Param('powstId') powstId: string,
    @Body('userId') userId: string,
  ) {
    return this.powstService.unlikePowst(powstId, userId);
  }
}

// TODO @thesudeshdas => Create the validation for create powst
