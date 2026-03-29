import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TeacherCourse } from 'src/teachers/entities/teacher_course.entity';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Course,
      Lesson,
      Teacher,
      TeacherCourse,
      Video
    ])
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
