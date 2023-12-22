import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './auth.dto';
import { validatePassword } from 'src/utils/validatePassword';
import * as bcrypt from 'bcrypt';

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
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

  async login(@Body() loginUserDto: LoginUserDto): Promise<ITokenResponse> {
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
      const tokens = await this.getTokens(findUser._id, findUser.email);

      await this.updateRefreshToken(findUser._id, tokens.refreshToken);

      return tokens;
    }
  }

  async refreshTokens(refreshToken: string) {
    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (!user || !user.refreshToken) {
      console.log('here');

      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = user.refreshToken === refreshToken;

    if (!refreshTokenMatches) {
      console.log('or here');

      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user._id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hashedRefreshToken = await bcrypt.hash(data, salt);

    return hashedRefreshToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async getTokens(userId: string, email: string): Promise<ITokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET_ACCESS,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
