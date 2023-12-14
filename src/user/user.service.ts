import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly _userModel: Model<User>,
  ) {}

  async create(username: string): Promise<User> {
    const existingUser = await this._userModel.findOne({ username });
    if (existingUser) {
      throw new ForbiddenException(
        // JSON.stringify({
        //   status: 777,
        // message:
        `User with username "${username}" already exists.`,
        //   ,
        // }),
      );
    }

    const createdAt = new Date();

    const createdUser = await this._userModel.create({
      username,
      createdAt,
    });

    return createdUser;
  }

  async getAllUsers(): Promise<User[]> {
    const usersList = await this._userModel.find();

    if (!usersList || usersList.length === 0) {
      throw new NotFoundException('No users found.');
    }

    return usersList;
  }
}
