import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './auth.dto';
import { validatePassword } from 'src/utils/validatePassword';
import { User } from 'src/schema/users.schema';

export interface TokenResponse {
  accessToken: string;
  // refreshToken: string;
}

export interface Token {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenResponse> {
    const findUser = await this.usersService.findUserEmail(loginUserDto.email);

    if (!findUser) {
      throw new NotFoundException('No user exists using this email address');
    } else if (
      !(await validatePassword({
        stored: findUser.password,
        provided: loginUserDto.password,
      }))
    ) {
      throw new UnauthorizedException('The password is incorrect');
    } else {
      return {
        accessToken: await this.jwtService.signAsync(
          { sub: findUser.email },
          this.getTokenOptions(),
        ),
      };
    }
  }

  async validate(@Body() email: string, password: string): Promise<User> {
    const findUser = await this.usersService.findUserEmail(email);

    if (!findUser) {
      throw new NotFoundException('No user exists using this email address');
    } else if (
      !(await validatePassword({
        stored: findUser.password,
        provided: password,
      }))
    ) {
      throw new UnauthorizedException('The password is incorrect');
    } else {
      console.log('mil gaya');

      return findUser;
    }
  }

  private getTokenOptions() {
    const jwtSecret = process.env.JWT_SECRET;

    console.log('kya hai login secret?', jwtSecret);

    const options: JwtSignOptions = {
      secret: `${jwtSecret}`,
      expiresIn: '60m',
    };

    return options;
  }
}
