import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({
    required: [true, 'Blog link is required'],
  })
  link: string;

  @Prop({
    required: [true, 'Blog title is required'],
    minlength: [2, 'Blog title must be at least 2 characters long'],
    maxlength: [128, 'Blog title must be less than 128 characters'],
  })
  title: string;

  @Prop()
  platform: 'medium' | 'hashnode' | 'devTo' | 'personal';

  @Prop({
    type: SchemaTypes.ObjectId,
    required: [true, 'Blog can not be created without a valid userId'],
    ref: 'User',
  })
  owner: User;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
