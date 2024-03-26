import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { BlogDocument } from 'src/schema/blog.schema';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}
  @Public()
  @Get('/:userId')
  getAllUserBlogs(@Param('userId') userId) {
    return this.blogService.getAllUserBlogs(userId);
  }

  @Post()
  createBlog(@Body() createBlogDto): Promise<BlogDocument> {
    return this.blogService.createBlog(createBlogDto);
  }
}
