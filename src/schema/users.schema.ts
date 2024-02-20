import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

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
  techStack: { name: string; version: string }[];

  @Prop()
  headline: string;
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
