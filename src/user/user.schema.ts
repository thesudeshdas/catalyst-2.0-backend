import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class UserDocument {
  @Prop()
  username: string;

  @Prop()
  createdAt: Date;
}

export type User = UserDocument & Document;

export const UserSchema = SchemaFactory.createForClass(UserDocument);
