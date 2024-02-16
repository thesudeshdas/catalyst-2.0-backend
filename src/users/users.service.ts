import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/users.schema';
import { RegisterUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
