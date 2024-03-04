import {
  Body,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { UpdateUserDto } from './users.dto';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(@Body() createUserDto): Promise<UserDocument> {
    createUserDto.username = createUserDto.email;

    const createdUser = await this.userModel.create(createUserDto);

    return createdUser.save();
  }

  async findUserEmail(@Body() email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findByRefreshToken(
    @Body() refreshToken: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ refreshToken: refreshToken }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async getPublicProfile(userId: string): Promise<UserDocument> {
    return this.userModel
      .findById(userId)
      .select('-refreshToken -accessToken -password')
      .populate([
        {
          path: 'powsts.powst',
          select: '_id title image imageAlt owner description',
          options: {
            limit: 4,
          },
        },
        {
          path: 'blogs.blog',
          select: '_id title link platform owner ',
          options: {
            limit: 4,
          },
        },
      ])
      .lean()
      .exec();
  }

  async updateUser(
    userId: string,
    updateUserDto,
    profilePic: Express.Multer.File,
  ): Promise<UserDocument> {
    if (profilePic) {
      const updatedProfilePic = await this.uploadImageToCloudinary(profilePic);

      return this.userModel
        .findOneAndUpdate(
          { _id: userId },
          { ...updateUserDto, profilePic: updatedProfilePic },
          {
            new: true,
          },
        )
        .populate([
          {
            path: 'powsts.powst',
            select: '_id title image imageAlt owner description',
            options: {
              limit: 4,
            },
          },
          {
            path: 'blogs.blog',
            select: '_id title link platform owner ',
            options: {
              limit: 4,
            },
          },
        ])
        .select('-refreshToken -accessToken -password');
    }

    return this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { ...updateUserDto },
        {
          new: true,
        },
      )
      .populate([
        {
          path: 'powsts.powst',
          select: '_id title image imageAlt owner description',
          options: {
            limit: 4,
          },
        },
        {
          path: 'blogs.blog',
          select: '_id title link platform owner ',
          options: {
            limit: 4,
          },
        },
      ])
      .select('-refreshToken -accessToken -password');
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

  async findPowstsByUser(userId: string) {
    return this.userModel
      .findById(userId)
      .select('powsts')
      .populate([
        {
          path: 'powsts.powst',
          select: '_id title image imageAlt owner description ',
        },
      ])
      .lean()
      .exec();
  }

  async findUsername(username: string) {
    const foundUsername = await this.userModel.findOne({ username: username });

    if (foundUsername) {
      return {
        success: false,
        message: 'Username is already taken. Please try again',
      };
    }
    return {
      success: true,
      message: 'Username is available',
    };
  }
}
