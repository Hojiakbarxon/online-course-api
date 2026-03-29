import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ISuccess } from 'src/interfaces/success-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TeacherCourse } from 'src/teachers/entities/teacher_course.entity';
import { remover } from 'src/common/base.update';

@Injectable()
export class LessonService {

  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(TeacherCourse) private readonly teacherCourseRepo: Repository<TeacherCourse>

  ) { }

  async create(createLessonDto: CreateLessonDto): Promise<ISuccess> {
    let { courseId, teacherId } = createLessonDto;
    let availableCourse = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: {
        lessons: true,
        teachers: {
          teacher: true
        }
      }
    });
    if (!availableCourse) {
      throw new NotFoundException(`The course with this ${courseId} id is not found`);
    }

    let availableTeacher = await this.teacherRepo.findOneBy({ id: teacherId });
    if (!availableTeacher) {
      throw new NotFoundException(`The teacher with this ${teacherId} id is not found`);
    }

    let belonging =  availableCourse.teachers.some(tc => tc.teacher.id === teacherId)
    if (!belonging) {
      throw new ForbiddenException(`You do not belong to this course`)
    }
    let newLesson = this.lessonRepo.create({
      ...createLessonDto,
      course: availableCourse,
      teacher: availableTeacher,
    });


    await this.lessonRepo.save(newLesson);

    let data = {
      id: newLesson.id,
      title: newLesson.title,
      description: newLesson.description,
      course: {
        id: newLesson.course.id,
        title: newLesson.course.title
      },
      teacher: {
        id: newLesson.teacher.id,
        fullName: newLesson.teacher.fullName,
        email: newLesson.teacher.email
      }
    }
    return {
      statusCode: 201,
      message: "created",
      data
    };
  }

  async findAll(): Promise<ISuccess> {
    let lessons = await this.lessonRepo.find({
      relations: {
        course: true,
        teacher: true,
        videos: true
      },
    });

    let data = lessons.map(ls => ({
      id: ls.id,
      title: ls.title,
      description: ls.description,
      orderIndex: ls.orderIndex,
      course: {
        id: ls.course.id,
        title: ls.course.title,
      },
      teacher: {
        fullName: ls.teacher.fullName,
        email: ls.teacher.email,
      },
      videos: ls.videos.map(vd => ({
        id: vd.id,
        title: vd.title,
        orderIndex: vd.orderIndex
      }))
    }));

    return {
      statusCode: 200,
      message: "success",
      data,
    };
  }

  async findOne(id: number): Promise<ISuccess> {
    let existedLesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        course: true,
        teacher: true,
        videos: true
      },
    });

    if (!existedLesson) {
      throw new NotFoundException(`The lesson with this ${id} is not found`);
    }

    let data = {
      id: existedLesson.id,
      title: existedLesson.title,
      description: existedLesson.description,
      orderIndex: existedLesson.orderIndex,
      course: {
        id: existedLesson.course.id,
        title: existedLesson.course.title,
      },
      teacher: {
        fullName: existedLesson.teacher.fullName,
        email: existedLesson.teacher.email,
      },
      videos: existedLesson.videos.map(vd => ({
        id: vd.id,
        title: vd.title,
        orderIndex: vd.orderIndex
      }))
    };

    return {
      statusCode: 200,
      message: "success",
      data
    };
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<ISuccess> {

    let existedLesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        course: { teachers: { teacher: true } },
        teacher: true,
      },
    })

    if (!existedLesson) {
      throw new NotFoundException(`The lesson with this ${id} id is not found`)
    }

    await this.lessonRepo.update(id, {
      title: updateLessonDto?.title,
      description: updateLessonDto?.description,
      orderIndex: updateLessonDto?.orderIndex
    })

    let updatedLesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        course: { teachers: { teacher: true } },
        teacher: true,
      },
    }) as Lesson

    let data = {
      id: updatedLesson.id,
      title: updatedLesson.title,
      description: updatedLesson.description,
      orderIndex: updatedLesson.orderIndex,
      course: {
        id: updatedLesson.course.id,
        title: updatedLesson.course.title,
        teachers: updatedLesson.course.teachers.map(tc => ({
          fullName: tc.teacher.fullName,
          email: tc.teacher.email,
        })),
      },
      teacher: {
        fullName: updatedLesson.teacher.fullName,
        email: updatedLesson.teacher.email,
      },
    }

    return {
      statusCode: 200,
      message: "updated",
      data
    }
  }

  async remove(id: number): Promise<ISuccess> {
    return await remover(id, this.lessonRepo)
  }
}