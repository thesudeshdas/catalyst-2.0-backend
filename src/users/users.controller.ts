import { Controller, Get } from '@nestjs/common';
import { User } from 'src/schema/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('check')
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
