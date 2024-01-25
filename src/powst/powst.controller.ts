import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PowstService } from './powst.service';
import { CreatePowstDto, createPowstSchema } from './powst.dto';
import { PowstDocument } from 'src/schema/powst.schema';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('powst')
export class PowstController {
  constructor(private powstService: PowstService) {}

  @Get()
  getAllPowst() {
    return this.powstService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  // @UsePipes(new ZodValidationPipe(createPowstSchema))
  createPowst(
    @Body() createPowstDto: CreatePowstDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PowstDocument> {
    console.log({ createPowstDto, image });

    const x = this.powstService.create(createPowstDto, image);

    console.log({ x });

    return x;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
