import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { StudentCourse } from 'src/students/entities/student-course.entity';
import { TeacherCourse } from 'src/teachers/entities/teacher_course.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      StudentCourse,
      TeacherCourse,
      Lesson
    ])
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule { }
