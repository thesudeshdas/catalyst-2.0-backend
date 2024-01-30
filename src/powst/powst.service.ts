import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Powst } from 'src/schema/powst.schema';
import { PowstDocument } from 'src/schema/powst.schema';
import { CreatePowstDto } from './powst.dto';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class PowstService {
  constructor(
    @InjectModel(Powst.name) private powstModel: Model<PowstDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    @Body() createPowstDto: CreatePowstDto,
    image: Express.Multer.File,
  ): Promise<PowstDocument> {
    const uploadedImage = await this.cloudinary.uploadImage(image);

    if (uploadedImage?.secure_url) {
      const createdPowst = await this.powstModel.create({
        ...createPowstDto,
        image: uploadedImage?.secure_url,
      });

      return createdPowst.save();
    } else {
      throw new HttpException('Something went wrong. Check kar', 500);
    }
  }

  async findAll(): Promise<PowstDocument[]> {
    return this.powstModel.find().exec();
  }
}
