import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  powstPopulation,
  userPopulation,
} from 'src/constants/population.constants';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { Powst, PowstDocument } from 'src/schema/powst.schema';
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

    return savedPowst.populate('owner', userPopulation);
  }

  async findAll(): Promise<PowstDocument[]> {
    return this.powstModel
      .find()
      .populate('owner', userPopulation)
      .lean()
      .exec();
  }

  async findById(powstId: string): Promise<PowstDocument> {
    return this.powstModel.findById(powstId).populate('owner', userPopulation);
  }

  async findPowstsByUser(userId: string) {
    return this.userModel
      .findById(userId)
      .select('powsts')
      .populate([
        {
          path: 'powsts.powst',
          select: powstPopulation,
        },
      ])
      .lean()
      .exec();
  }

  async likePowst(powstId: string, userId: string) {
    const findPowst = await this.powstModel.findById(powstId);

    if (!findPowst) {
      throw new NotFoundException(
        'The powst you are trying to like does not exist',
      );
    }

    if (findPowst?.likedBy?.includes(userId)) {
      throw new ConflictException('The powst is already liked by this user');
    }

    return this.powstModel.findByIdAndUpdate(
      powstId,
      { $inc: { noOfLikes: 1 }, $addToSet: { likedBy: userId } },
      { new: true },
    );
  }

  async unlikePowst(powstId: string, userId: string) {
    const findPowst = await this.powstModel.findById(powstId);

    if (!findPowst) {
      throw new NotFoundException(
        'The powst you are trying to unlike does not exist',
      );
    }

    if (!findPowst?.likedBy?.includes(userId)) {
      throw new ConflictException('The powst is not yet liked by this user');
    }

    return this.powstModel.findByIdAndUpdate(
      powstId,
      { $inc: { noOfLikes: -1 }, $pull: { likedBy: userId } },
      { new: true },
    );
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
      noOfLikes: 0,
      likedBy: [],
    });

    return createdPowst.save();
  }
}

// TODO @thesudeshdas => When the user creates a new powst, the powst id should be saved in the user document as well
