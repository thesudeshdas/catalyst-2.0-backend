import { Controller, Get } from '@nestjs/common';
import { User } from 'src/schema/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('check')
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
