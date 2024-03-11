import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userPopulation } from 'src/constants/population.constants';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { User, UserDocument } from 'src/schema/user.schema';
import { Work, WorkDocument } from 'src/schema/work.schema';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel(Work.name) private workModel: Model<WorkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async createWork(
    createWorkDto,
    image: Express.Multer.File,
  ): Promise<WorkDocument> {
    const uploadedImage = await this.uploadImageToCloudinary(image);
    const createdWork = await this.create(createWorkDto, uploadedImage);

    const savedPowst = await createdWork.save();

    return savedPowst.populate('owner', userPopulation);
  }

  private async uploadImageToCloudinary(image: Express.Multer.File) {
    const uploadedImage = await this.cloudinary.uploadImage(image);

    if (!uploadedImage?.secure_url) {
      throw new HttpException(
        'Something went wrong while uploading the image',
        500,
      );
    }

    return uploadedImage.secure_url;
  }

  private async create(createWorkDto, imageUrl: string) {
    const createdWork = await this.workModel.create({
      ...createWorkDto,
      image: imageUrl,
    });

    return createdWork.save();
  }
}
