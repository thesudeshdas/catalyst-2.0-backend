import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [BlogService],
  exports: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
