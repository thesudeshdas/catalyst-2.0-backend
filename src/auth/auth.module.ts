import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { UsersService } from 'src/users/users.service';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    JwtModule.register({}),
    CloudinaryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [UsersService, AuthService],
})
export class AuthModule {}
