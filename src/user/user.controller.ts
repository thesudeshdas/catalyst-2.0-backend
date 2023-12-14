import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';

interface CreateUserPayload {
  username: string;
}

@Controller()
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  async create(
    @Body() payload: CreateUserPayload,
    @Res() response,
  ): Promise<User> {
    try {
      const createdUser = await this._userService.create(payload.username);

      return response.status(HttpStatus.CREATED).json({
        message: 'This user is created',
        createdUser,
      });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  @Get()
  async getUsers(@Res() response): Promise<User[]> {
    try {
      const usersList = await this._userService.getAllUsers();

      return response.status(HttpStatus.OK).json({
        message: 'All users are here',
        usersList: usersList,
      });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
