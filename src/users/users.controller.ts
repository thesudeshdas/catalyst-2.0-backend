import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserDocument } from 'src/schema/user.schema';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get('/:userId')
  getPublicProfile(@Param('userId') userId): Promise<UserDocument> {
    return this.usersService.getPublicProfile(userId);
  }

  @Post('/:userId')
  @UseInterceptors(FileInterceptor('profilePic'))
  updateUser(
    @Param('userId') userId,
    @Body() updateUserDto,
    @UploadedFile() profilePic: Express.Multer.File,
  ) {
    return this.usersService.updateUser(userId, updateUserDto, profilePic);
  }

  @Public()
  @Get('/username/:username')
  getUsernameAvailability(@Param('username') username) {
    return this.usersService.findUsername(username);
  }

  // Steps to follow
  // step 1 => Check if the user is trying to follow themselves, if not, continue, otherwise throw error
  // step 2 => Check if the user whom is to be followed exist or not, if exists, continue, otherwise throw error
  // step 3 => Check if the user is already following the user, if not, continue, otherwise throw error
  // step 4 => All validation complete, follow the user, update both the users with the correct followings, followers, noOfFollowings, noOfFollowers data
  @Public()
  @Post('/:userId/follow')
  async followUser(@Request() req, @Param('userId') userId, @Body() body) {
    const { userToFollow } = body;

    if (userId === userToFollow) {
      throw new BadRequestException('You can not follow yourself');
    } else if (!(await this.usersService.findUserById(userToFollow))) {
      throw new NotFoundException(
        'The user you are trying to follow does not exist',
      );
    } else if (
      await this.usersService.userAlreadyFollows(userId, userToFollow)
    ) {
      throw new BadRequestException('Your already follow this user');
    }

    return this.usersService.followUser(userId, userToFollow);
  }

  // Steps to unfollow
  // step 1 => Check if the user is trying to unfollow themselves, if not, continue, otherwise throw error
  // step 2 => Check if the user whom is to be followed exist or not, if exists, continue, otherwise throw error
  // step 3 => Check if the user is already following the user, if following, continue, otherwise throw error
  // step 4 => All validation complete, unfollow the user, update both the users with the correct followings, followers, noOfFollowings, noOfFollowers data
  @Public()
  @Post('/:userId/unfollow')
  async unfollowUser(@Request() req, @Param('userId') userId, @Body() body) {
    const { userToUnFollow } = body;

    if (userId === userToUnFollow) {
      throw new BadRequestException('You can not unfollow yourself');
    } else if (!(await this.usersService.findUserById(userToUnFollow))) {
      throw new NotFoundException(
        'The user you are trying to unfollow does not exist',
      );
    } else if (
      !(await this.usersService.userAlreadyFollows(userId, userToUnFollow))
    ) {
      throw new BadRequestException('You do not follow the user yet');
    }

    return this.usersService.unfollowUser(userId, userToUnFollow);
  }
}
