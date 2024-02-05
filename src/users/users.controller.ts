import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get('profile/:id')
  async getPublicProfile(@Param('id') id) {
    return this.usersService.findById(id);
  }
}
