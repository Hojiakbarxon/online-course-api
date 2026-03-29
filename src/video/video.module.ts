import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Video } from './entities/video.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Video, Lesson])
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule { }
