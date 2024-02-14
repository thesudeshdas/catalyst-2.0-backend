import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PowstService } from './powst.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PowstDocument } from 'src/schema/powst.schema';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('powst')
export class PowstController {
  constructor(private powstService: PowstService) {}

  @Public()
  @Get()
  getAllPowst() {
    return this.powstService.findAll();
  }

  @Public()
  @Get('user/:userId')
  getAllUserPowsts(@Param('userId') userId): Promise<PowstDocument[]> {
    return this.powstService.findPowstsById(userId);
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
