import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherCourse } from './entities/teacher_course.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Student } from 'src/students/entities/student.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      TeacherCourse,
      Course,
      Student,
      Lesson
    ])
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule { }
