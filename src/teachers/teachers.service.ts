import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { ISuccess } from 'src/interfaces/success-response.interface';
import { Teacher } from './entities/teacher.entity';
import { TeacherCourse } from './entities/teacher_course.entity';
import { title } from 'process';
import { handleEnrollmentUpdate, remover } from 'src/common/base.update';

@Injectable()
export class TeachersService {

  constructor(
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(TeacherCourse) private readonly teacherCourseRepo: Repository<TeacherCourse>
  ) { }


  async create(createTeacherDto: CreateTeacherDto): Promise<ISuccess> {
    let { email, courseId } = createTeacherDto
    for (let id of courseId) {
      let existedCourse = await this.courseRepo.findOneBy({ id })
      if (!existedCourse) {
        throw new NotFoundException(`Course is not found`)
      }
    }
    let existedTeacher = await this.teacherRepo.findOneBy({ email })
    if (existedTeacher) {
      throw new ConflictException(`The teacher with this email already exists`)
    }

    let newTeacher = this.teacherRepo.create({ fullName: createTeacherDto.fullName, email })
    await this.teacherRepo.save(newTeacher)

    for (let id of courseId) {
      let course = await this.courseRepo.findOneBy({ id }) as Course
      let enrollment = this.teacherCourseRepo.create({
        course: course,
        teacher: newTeacher
      })
      await this.teacherCourseRepo.save(enrollment)
    }

    let result = await this.teacherRepo.findOne({
      where: { id: newTeacher.id },
      relations: {
        courses: {
          course: {
            teachers: { teacher: true }
          }
        }
      }
    })

    return {
      statusCode: 201,
      message: "success",
      data: result as Object
    }
  }

  async findAll(): Promise<ISuccess> {
    let teachers = await this.teacherRepo.find({
      relations: {
        courses: {
          course: {
            students: { student: true },
            lessons: true
          }
        },
        lessons: true
      },
      order: { createdAt: 'DESC' }
    })

    let data = teachers.map(teacher => ({
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      courses: teacher.courses.map(tc => ({
        id: tc.course.id,
        title: tc.course.title,
        description: tc.course.description,
        lessons: tc.course.lessons.map(ls => ({
          id: ls.id,
          title: ls.title,
          orderIndex: ls.orderIndex
        })),
        students: tc.course.students.map(st => ({
          id: st.student.id,
          fullName: st.student.fullName
        }))
      })),
      lesson: teacher.lessons.map(ls => ({
        id: ls.id,
        title: ls.title,
        description: ls.description
      }))
    }))

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let existedTeacher = await this.teacherRepo.findOne({
      where: { id },
      relations: {
        courses: {
          course: {
            students: { student: true },
            lessons: true
          }
        },
        lessons: true
      }
    })

    if (!existedTeacher) {
      throw new NotFoundException(`The teacher is not found`)
    }

    let data = {
      id: existedTeacher.id,
      fullName: existedTeacher.fullName,
      email: existedTeacher.email,
      courses: existedTeacher.courses.map(cr => ({
        title: cr.course.title,
        description: cr.course.description,
        lessons: cr.course.lessons.map(ls => ({   // ← add this
          id: ls.id,
          title: ls.title,
          orderIndex: ls.orderIndex
        })),
        students: cr.course.students.map(st => ({
          id: st.student.id,
          fullName: st.student.fullName
        }))
      })),
      lessons: existedTeacher.lessons.map(ls => ({
        id: ls.id,
        title: ls.title,
        description: ls.description,
        order_index: ls.orderIndex
      }))
    }
    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<ISuccess> {
    let updatedTeacher = await handleEnrollmentUpdate(id, updateTeacherDto, {
      mainRepo: this.teacherRepo,
      courseRepo: this.courseRepo,
      enrollmentRepo: this.teacherCourseRepo,
      enrollmentKey: "teacher"
    })

    updatedTeacher = await this.teacherRepo.findOne({
      where: { id },
      relations: {
        courses: {
          course: {
            students: {
              student: true
            }
          }
        }
      }
    })

    let data = {
      id: updatedTeacher.id,
      fullName: updatedTeacher.fullName,
      couses: updatedTeacher.courses.map(cr => ({
        id: cr.course.id,
        title: cr.course.title,
        description: cr.course.description,
        students: cr.course.students.map(st => ({
          id: st.student.id,
          fullName: st.student.fullName
        }))
      }))
    }

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async remove(id: number): Promise<ISuccess> {
    return await remover(id, this.teacherRepo)
  }
}
