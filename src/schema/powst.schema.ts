import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    minlength: [50, 'Project description must be at least 50 characters long'],
    maxlength: [100, 'Project description must be less than 1000 characters'],
  })
  description: string;

  @Prop()
  techStack: { name: string; version: string }[];
}

export const PowstSchema = SchemaFactory.createForClass(Powst);
