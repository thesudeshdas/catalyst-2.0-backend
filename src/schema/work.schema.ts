import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.schema';

export type WorkDocument = Work & Document;

@Schema()
export class Work {
  @Prop({
    required: [true, 'Company name is required'],
  })
  company: string;

  @Prop()
  companyWebsite: string;

  @Prop()
  companyLogo: File;

  @Prop({
    required: [true, 'Start date is required'],
    type: { month: String, year: String },
  })
  startDate: { month: string; year: string };

  @Prop({
    required: [true, 'End date is required'],
    type: { month: String, year: String },
  })
  endDate: { month: string; year: string };

  @Prop({
    required: [true, 'Designation is required'],
  })
  designation: string;

  @Prop({
    type: String,
    enum: ['Full Time', 'Part Time', 'Internship', 'Freelance'],
  })
  workType: string;

  @Prop()
  location: string;

  @Prop()
  techStack: { name: string; version: string }[];

  @Prop()
  keywords: string[];

  @Prop()
  description: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: [true, 'Work can not be created without a valid userId'],
    ref: 'User',
  })
  owner: User;
}

export const WorkSchema = SchemaFactory.createForClass(Work);
