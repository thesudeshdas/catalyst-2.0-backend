import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Powst } from './powst.schema';
import { Blog } from './blog.schema';
import { Work } from './work.schema';

export type UserDocument = User & Document;

@Schema()
class Socials {
  @Prop()
  name: string;

  @Prop()
  link: string;
}

@Schema()
export class User {
  @Prop({
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [32, 'Name must be less than 32 characters'],
  })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    unique: true,
  })
  username: string;

  @Prop({ enum: ['active', 'deprecated', 'inactive'], default: 'active' })
  status: 'active' | 'inactive' | 'deprecated';

  @Prop()
  refreshToken: string;

  @Prop()
  accessToken: string;

  @Prop()
  profilePic: string;

  @Prop()
  bio: string;

  @Prop()
  description: string;

  @Prop()
  specialisation: string[];

  @Prop()
  techStack: { name: string; version: string }[];

  @Prop()
  headline: string;

  @Prop()
  location: string;

  @Prop()
  socials: Socials[];

  @Prop({
    type: [
      {
        powst: {
          type: SchemaTypes.ObjectId,
          ref: 'Powst',
          required: [true, 'Powst can not be created without a valid id'],
        },
      },
    ],
  })
  powsts: { powst: Powst }[];

  @Prop({
    type: [
      {
        blog: {
          type: SchemaTypes.ObjectId,
          ref: 'Blog',
          required: [true, 'Blog can not be created without a valid id'],
        },
      },
    ],
  })
  blogs: { blog: Blog }[];

  @Prop({
    type: [
      {
        work: {
          type: SchemaTypes.ObjectId,
          ref: 'Work',
          required: [true, 'Work can not be created without a valid id'],
        },
      },
    ],
  })
  works: { work: Work }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user: User = this as any;

  if (!user.password || user.password.startsWith('$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});
