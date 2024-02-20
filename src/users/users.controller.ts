import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserDocument } from 'src/schema/users.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile/:id')
  getUserDetails(@Param('id') id) {
    return this.usersService.findById(id);
  }

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
}
