import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentCourse } from './entities/student-course.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      StudentCourse,
      Course
    ])
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule { }
