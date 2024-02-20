import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/users.schema';
import { RegisterUserDto, UpdateUserDto } from './users.dto';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(@Body() createUserDto: RegisterUserDto): Promise<UserDocument> {
    const createdUser = await this.userModel.create(createUserDto);

    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .select('-refreshToken -accessToken -password')
      .lean()
      .exec();
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
}
