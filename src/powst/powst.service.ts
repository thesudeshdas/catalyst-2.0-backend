import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Powst } from 'src/schema/powst.schema';
import { PowstDocument } from 'src/schema/powst.schema';
import { CreatePowstDto } from './powst.dto';

@Injectable()
export class PowstService {
  constructor(
    @InjectModel(Powst.name) private powstModel: Model<PowstDocument>,
  ) {}

  async create(@Body() createPowstDto: CreatePowstDto): Promise<PowstDocument> {
    console.log({ createPowstDto });

    const createdPowst = await this.powstModel.create(createPowstDto);

    console.log({ createdPowst });

    return createdPowst.save();
  }

  async findAll(): Promise<PowstDocument[]> {
    return this.powstModel.find().exec();
  }
}
