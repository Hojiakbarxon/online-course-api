import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { Course } from './courses/entities/course.entity';
import { Student } from './students/entities/student.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { StudentCourse } from './students/entities/student-course.entity';
import { TeacherCourse } from './teachers/entities/teacher_course.entity';
import { LessonModule } from './lesson/lesson.module';
import { VideoModule } from './video/video.module';
import { Lesson } from './lesson/entities/lesson.entity';
import { Video } from './video/entities/video.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: String(process.env.DB_URL),
      synchronize: true,
      entities: [Course, Student, Teacher, StudentCourse, TeacherCourse, Lesson, Video]
    }),
    CoursesModule,
    TeachersModule,
    StudentsModule,
    LessonModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
