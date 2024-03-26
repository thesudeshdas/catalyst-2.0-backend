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

// import types
import { ILoginResponse, IRefreshTokenResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const findUser = await this.usersService.findUserByEmail(
      loginUserDto.email,
    );

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

      return {
        ...tokens,
        email: findUser.email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        userId: findUser._id,
        username: findUser.username,
      };
    }
  }

  async refreshTokens(refreshToken: string) {
    const decodedUser = await this.jwtService.decode(refreshToken);

    if (!decodedUser) {
      throw new ForbiddenException('The refresh token is invalid');
    }

    const user = await this.usersService.findUserByEmail(decodedUser.email);

    if (!user) {
      throw new NotFoundException('No user found for this email');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('The refresh token is invalid');
    }

    const tokens = await this.getTokens(user._id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const signedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(userId, {
      refreshToken: signedRefreshToken,
    });
  }

  async getTokens(
    userId: string,
    email: string,
  ): Promise<IRefreshTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET_ACCESS,
          expiresIn: '60m',
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
