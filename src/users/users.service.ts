import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { UpdateUserDto } from './users.dto';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

const powstPopulation = '_id title image imageAlt owner description';
const blogPopulation = '_id title link platform owner ';

const removeTokenAndPassword = '-refreshToken -accessToken -password';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async createUser(@Body() createUserDto): Promise<UserDocument> {
    createUserDto.username = createUserDto.email;
    createUserDto.profilePic =
      'https://res.cloudinary.com/thesudeshdas/image/upload/v1710683335/catalyst-2/user-avatar-default-bg_zhvozj.png';

    const createdUser = await this.userModel.create(createUserDto);

    return createdUser.save();
  }

  async updateUser(
    userId: string,
    updateUserDto,
    profilePic: Express.Multer.File,
  ): Promise<UserDocument> {
    const updateFields = profilePic
      ? {
          ...updateUserDto,
          profilePic: await this.uploadImageToCloudinary(profilePic),
        }
      : { ...updateUserDto };

    return this.userModel
      .findByIdAndUpdate(userId, updateFields, { new: true })
      .populate([
        {
          path: 'powsts.powst',
          select: powstPopulation,
          options: { limit: 4 },
        },
        {
          path: 'blogs.blog',
          select: blogPopulation,
          options: { limit: 4 },
        },
      ])
      .select(removeTokenAndPassword)
      .exec();
  }

  async findUserByEmail(@Body() email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).exec();
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

  async updateRefreshToken(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async getPublicProfile(userId: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ username: userId })
      .select(removeTokenAndPassword)
      .populate([
        {
          path: 'powsts.powst',
          select: powstPopulation,
          options: {
            limit: 4,
          },
        },
        {
          path: 'blogs.blog',
          select: blogPopulation,
          options: {
            limit: 4,
          },
        },
      ])
      .lean()
      .exec();
  }

  async findPowstsByUser(userId: string) {
    return this.userModel
      .findOne({ username: userId })
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
}
