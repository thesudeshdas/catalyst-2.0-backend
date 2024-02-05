import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UserDocument } from 'src/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto, RefreshTokensDto, loginUserSchema } from './auth.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { RegisterUserDto, registerUserSchema } from 'src/users/users.dto';
import { ILoginResponse, IRefreshTokenResponse } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    return this.authService.login(loginUserDto);
  }

  @Public()
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserDocument> {
    if (await this.userService.findUserEmail(registerUserDto.email)) {
      throw new BadRequestException('User with this email already exists');
    }

    const createdUser = await this.userService.create(registerUserDto);

    const tokens = await this.authService.getTokens(
      createdUser._id,
      createdUser.email,
    );

    await this.authService.updateRefreshToken(
      createdUser._id,
      tokens.refreshToken,
    );

    const sanitisedUser = createdUser;

    sanitisedUser.accessToken = tokens.accessToken;
    sanitisedUser.refreshToken = tokens.refreshToken;

    return sanitisedUser;
  }

  @Public()
  @Post('refresh')
  async refreshTokens(
    @Body() refreshTokensDto: RefreshTokensDto,
  ): Promise<IRefreshTokenResponse> {
    return this.authService.refreshTokens(refreshTokensDto.refreshToken);
  }
}
