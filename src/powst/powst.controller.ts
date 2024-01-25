import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { PowstService } from './powst.service';
import { CreatePowstDto, createPowstSchema } from './powst.dto';
import { PowstDocument } from 'src/schema/powst.schema';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';

@Controller('powst')
export class PowstController {
  constructor(private powstService: PowstService) {}

  @Get()
  getAllPowst() {
    return this.powstService.findAll();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPowstSchema))
  createPowst(@Body() createPowstDto: CreatePowstDto): Promise<PowstDocument> {
    const x = this.powstService.create(createPowstDto);

    console.log({ x });

    return x;
  }
}
