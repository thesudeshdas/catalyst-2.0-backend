import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  blogPopulation,
  powstPopulation,
  removeTokenAndPassword,
} from 'src/constants/population.constants';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { User, UserDocument } from 'src/schema/user.schema';

import { UpdateUserDto } from './users.dto';

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

  async findUserById(userId: string): Promise<UserDocument> {
    return this.userModel
      .findById(userId)
      .select(removeTokenAndPassword)
      .lean()
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

  // Checks if the user follows the other user. Assume that both the user are valid and the different. Return true if the follower follows the following, otherwise false.
  async userAlreadyFollows(
    follower: string,
    following: string,
  ): Promise<boolean> {
    const followerUser = await this.findUserById(follower);

    return followerUser.followings.includes(following);
  }

  // Work with the assumption that the user is trying to follow another valid user. All the checks for the same user following the same user, if the user already follows the user, etc should be managed by the controller
  async followUser(userId: string, userToFollow: string) {
    // update the user with the new following and increase the number of followings
    const newUpdatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { followings: userToFollow },
        $inc: { noOfFollowings: 1 },
      },
      { new: true },
    );

    // update the followed user with the new follower and increase the number of followers
    await this.userModel.findByIdAndUpdate(
      userToFollow,
      {
        $push: { followers: userId },
        $inc: { noOfFollowers: 1 },
      },
      { new: true },
    );

    return {
      success: true,
      message: 'Successfully followed',
      noOfFollowings: newUpdatedUser.noOfFollowings,
      followings: newUpdatedUser.followings,
    };
  }

  // Work with the assumption that the user is trying to unfollow another valid user.
  async unfollowUser(userId: string, userToUnfollow: string) {
    // update the user with the new following and decrease the number of followings
    const newUpdatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { followings: userToUnfollow },
        $inc: { noOfFollowings: -1 },
      },
      { new: true },
    );

    // update the followed user with the new follower and decrease the number of followers
    await this.userModel.findByIdAndUpdate(
      userToUnfollow,
      {
        $pull: { followers: userId },
        $inc: { noOfFollowers: -1 },
      },
      { new: true },
    );

    return {
      success: true,
      message: 'Successfully followed',
      noOfFollowings: newUpdatedUser.noOfFollowings,
      followings: newUpdatedUser.followings,
    };
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
