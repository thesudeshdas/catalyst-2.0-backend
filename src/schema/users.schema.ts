import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop({
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [32, 'Name must be less than 32 characters long'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  profilePic: string;

  @Prop()
  bio: string;

  @Prop({ enum: ['active', 'deprecated', 'inactive'], default: 'active' })
  status: 'active' | 'inactive' | 'deprecated';
}

export const UserSchema = SchemaFactory.createForClass(User);
