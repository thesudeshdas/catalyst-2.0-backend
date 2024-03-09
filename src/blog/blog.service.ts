import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from 'src/schema/blog.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBlog(createBlogDto): Promise<BlogDocument> {
    const createdBlog = await this.blogModel.create(createBlogDto);

    const savedBlog = await createdBlog.save();

    await this.userModel.findOneAndUpdate(
      {
        _id: createBlogDto.owner,
      },
      { $push: { blogs: { blog: savedBlog._id } } },
      { new: true },
    );

    return savedBlog.populate('owner', 'firstName lastName email');
  }

  async getAllUserBlogs(userId: string) {
    return this.userModel
      .findOne({ username: userId })
      .select('blogs')
      .populate({
        path: 'blogs.blog',
      })
      .lean()
      .exec();
  }
}
