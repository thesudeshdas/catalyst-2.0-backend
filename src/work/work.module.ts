import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { Work, WorkSchema } from 'src/schema/work.schema';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Work.name, schema: WorkSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [WorkService],
  exports: [WorkService],
  controllers: [WorkController],
})
export class WorkModule {}
