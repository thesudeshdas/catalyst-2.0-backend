import { Module } from '@nestjs/common';
import { PowstService } from './powst.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Powst, PowstSchema } from 'src/schema/powst.schema';
import { PowstController } from './powst.controller';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Powst.name, schema: PowstSchema }]),
    CloudinaryModule,
  ],
  providers: [PowstService],
  exports: [PowstService],
  controllers: [PowstController],
})
export class PowstModule {}
