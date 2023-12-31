import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/users.schema';
import { RegisterUserDto } from 'src/auth/auth.dto';
import { sanitiseAllUsers, sanitiseUser } from 'src/utils/sanitiseSchema.utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(@Body() createUserDto: RegisterUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);

    return createdUser.save();
  }

  async findUserEmail(@Body() email: string): Promise<User> {
    try {
      const findUser = await this.userModel.findOne({ email: email });

      if (!findUser) {
        // throw new NotFoundException('No user found using this email');
        return null;
      }

      return sanitiseUser(findUser);

      // return false;
    } catch (error) {
      throw new NotFoundException('No user found using this email');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const findUser = await this.userModel.find().exec();

      return sanitiseAllUsers(findUser);
    } catch (error) {
      throw new NotFoundException('Kuch nahi mila');
    }
  }
}
