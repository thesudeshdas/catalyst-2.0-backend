import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { Powst, PowstSchema } from 'src/schema/powst.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { PowstController } from './powst.controller';
import { PowstService } from './powst.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Powst.name, schema: PowstSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [PowstService],
  exports: [PowstService],
  controllers: [PowstController],
})
export class PowstModule {}
