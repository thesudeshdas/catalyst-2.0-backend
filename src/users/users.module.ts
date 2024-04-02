import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { User, UserSchema } from 'src/schema/user.schema';

import { UsersController } from './users.controller';
import { FindUserMiddleware } from './users.middlewares';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FindUserMiddleware)
      .forRoutes({ path: 'users/:userId/follow', method: RequestMethod.ALL });
  }
}
