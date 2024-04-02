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
    let uploadedImage;

    if (image) {
      uploadedImage = await this.uploadImageToCloudinary(image);
    } else {
      uploadedImage = 'http://via.placeholder.com/200x200';
    }

    const createdWork = await this.create(createWorkDto, uploadedImage);

    const savedWork = await createdWork.save();

    await this.userModel.findOneAndUpdate(
      {
        _id: savedWork.owner,
      },
      { $push: { works: { work: savedWork._id } } },
      { new: true },
    );

    return savedWork.populate('owner', userPopulation);
  }

  async getAllUserWorks(userId: string) {
    return this.userModel
      .findById(userId)
      .select('works')
      .populate('works.work');
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
      companyLogo: imageUrl,
    });

    return createdWork.save();
  }
}
