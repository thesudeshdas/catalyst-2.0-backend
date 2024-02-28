import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Powst, PowstDocument } from 'src/schema/powst.schema';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class PowstService {
  constructor(
    @InjectModel(Powst.name) private powstModel: Model<PowstDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    createPowstDto,
    image: Express.Multer.File,
  ): Promise<PowstDocument> {
    const uploadedImage = await this.uploadImageToCloudinary(image);
    const createdPowst = await this.createPowst(createPowstDto, uploadedImage);

    const savedPowst = await createdPowst.save();

    await this.userModel.findOneAndUpdate(
      {
        _id: createPowstDto.owner,
      },
      { $push: { powsts: { powst: savedPowst._id } } },
      { new: true },
    );

    return savedPowst.populate('owner', 'firstName lastName email');
  }

  async findAll(): Promise<PowstDocument[]> {
    return this.powstModel
      .find()
      .populate('owner', 'firstName lastName email')
      .lean()
      .exec();
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

  private async createPowst(createPowstDto, imageUrl: string) {
    const createdPowst = await this.powstModel.create({
      ...createPowstDto,
      image: imageUrl,
    });

    return createdPowst.save();
  }
}

// TODO @thesudeshdas => When the user creates a new powst, the powst id should be saved in the user document as well
