import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './users.schema';

export type PowstDocument = Powst & Document;

@Schema()
export class Powst {
  @Prop({
    required: [true, 'Project title is required'],
    minlength: [2, 'Project title must be at least 2 characters long'],
    maxlength: [32, 'Project title must be less than 32 characters'],
  })
  title: string;

  @Prop()
  live: string;

  @Prop()
  source: string;

  @Prop({
    required: [true, 'Project description is required'],
  })
  description: string;

  @Prop({
    required: [true, 'Tech stack is needed'],
  })
  techStack: { name: string; version: string }[];

  @Prop()
  image: File;

  @Prop()
  imageAlt: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: [true, 'Powst can not be created without a valid userId'],
    ref: 'User',
  })
  owner: User;
}

export const PowstSchema = SchemaFactory.createForClass(Powst);
