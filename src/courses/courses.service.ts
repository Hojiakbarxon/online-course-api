import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { ISuccess } from 'src/interfaces/success-response.interface';
import { remover } from 'src/common/base.update';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<ISuccess> {
    let { title } = createCourseDto
    let existedCourse = await this.courseRepo.findOneBy({ title })
    if (existedCourse) {
      throw new ConflictException(`Course title already exists choose another one`)
    }

    let newCourse = this.courseRepo.create(createCourseDto)
    await this.courseRepo.save(newCourse)

    return {
      statusCode: 201,
      message: "success",
      data: newCourse
    }
  }

  async findAll(): Promise<ISuccess> {
    let courses = await this.courseRepo.find({
      relations: {
        teachers: { teacher: true },
        students: { student: true },
        lessons: true
      },
      order: { createdAt: "DESC" }
    })

    let data = courses.map(cr => ({
      id: cr.id,
      title: cr.title,
      description: cr.description,
      duration: cr.duration,
      teachers: cr.teachers.map(tc => ({
        id: tc.teacher.id,
        fullName: tc.teacher.fullName,
        email: tc.teacher.email
      })),
      students: cr.students.map(st => ({
        id: st.student.id,
        fullName: st.student.fullName
      })),
      lessons: cr.lessons.map(ls => ({
        id: ls.id,
        title: ls.title,
        orderIndex: ls.orderIndex
      }))
    }))

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let existedCourse = await this.courseRepo.findOne({
      where: { id },
      relations: {
        teachers: { teacher: true },
        students: { student: true },
        lessons: true          // ← added
      }
    })

    if (!existedCourse) {
      throw new NotFoundException(`Course not found`)
    }

    let data = {
      id: existedCourse.id,
      title: existedCourse.title,
      description: existedCourse.description,
      duration: existedCourse.duration,
      teachers: existedCourse.teachers.map(tc => ({
        id: tc.teacher.id,
        fullName: tc.teacher.fullName,
        email: tc.teacher.email
      })),
      students: existedCourse.students.map(st => ({
        id: st.student.id,
        fullName: st.student.fullName,
        email: st.student.email
      })),
      lessons: existedCourse.lessons.map(ls => ({   // ← added
        id: ls.id,
        title: ls.title,
        orderIndex: ls.orderIndex
      }))
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<ISuccess> {
    let exists = await this.courseRepo.findOneBy({ id })
    if (!exists) {
      throw new NotFoundException(`The course with this id is not found`)
    }

    let { title } = updateCourseDto
    if (title) {
      let existedCourse = await this.courseRepo.findOne({ where: { title } })
      if (existedCourse && existedCourse.id !== id) {
        throw new ConflictException(`The course with this title already exists`)
      }
    }

    await this.courseRepo.update(id, updateCourseDto)

    let updatedCourse = await this.courseRepo.findOne({
      where: { id },
      relations: {
        teachers: { teacher: true },
        students: { student: true },
        lessons: true          // ← added
      }
    }) as Course

    let data = {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      duration: updatedCourse.duration,
      teachers: updatedCourse.teachers.map(tc => ({
        id: tc.teacher.id,
        fullName: tc.teacher.fullName,
        email: tc.teacher.email
      })),
      students: updatedCourse.students.map(st => ({
        id: st.student.id,
        fullName: st.student.fullName,
        email: st.student.email
      })),
      lessons: updatedCourse.lessons.map(ls => ({   // ← added
        id: ls.id,
        title: ls.title,
        orderIndex: ls.orderIndex
      }))
    }

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async remove(id: number): Promise<ISuccess> {
    return await remover(id, this.courseRepo)
  }
}