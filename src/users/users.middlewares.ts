import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { Model } from 'mongoose';
import {
  blogPopulation,
  powstPopulation,
  removeTokenAndPassword,
} from 'src/constants/population.constants';
import { User } from 'src/schema/user.schema';

@Injectable()
export class FindUserMiddleware implements NestMiddleware {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async use(req, res: Response, next: NextFunction) {
    const foundUser = await this.userModel
      .findById(req.params.userId)
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

    if (!foundUser) {
      throw new NotFoundException('No user found with this userID');
    }

    req.user = foundUser;

    next();
  }
}
