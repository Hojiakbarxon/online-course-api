import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { ISuccess } from 'src/interfaces/success-response.interface';
import { StudentCourse } from './entities/student-course.entity';
import { title } from 'process';
import { handleEnrollmentUpdate, remover } from 'src/common/base.update';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(StudentCourse) private readonly studentCourseRepo: Repository<StudentCourse>
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<ISuccess> {
    let { email, courseId } = createStudentDto
    if (courseId) {
      for (let id of courseId) {
        let existedCourse = await this.courseRepo.findOneBy({ id })
        if (!existedCourse) {
          throw new NotFoundException(`Course is not found`)
        }
      }
    }
    
    let existedstudent = await this.studentRepo.findOneBy({ email })
    if (existedstudent) {
      throw new ConflictException(`The student with this email already exists`)
    }

    let newStudent = this.studentRepo.create({ fullName: createStudentDto.fullName, email })
    await this.studentRepo.save(newStudent)

    for (let id of courseId) {
      let course = await this.courseRepo.findOneBy({ id })
      let enrollment = this.studentCourseRepo.create({
        student: newStudent,
        course: course as Course
      })
      await this.studentCourseRepo.save(enrollment)
    }

    let result = await this.studentRepo.findOne({
      where: { id: newStudent.id },
      relations: {
        courses: {
          course: {
            teachers: {
              teacher: true
            }
          }
        }
      }
    })

    return {
      statusCode: 201,
      message: "success",
      data: newStudent
    }
  }

  async findAll(): Promise<ISuccess> {
    let students = await this.studentRepo.find({
      relations: {
        courses: {
          course: {
            teachers: {
              teacher: true,
            }
          }
        },
      },
      order: { createdAt: "DESC" }
    })

    let data = students.map(student => ({
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      courses: student.courses.map(sc => ({
        id: sc.course.id,
        title: sc.course.title,
        teachers: sc.course.teachers.map(tc => ({
          id: tc.teacher.id,
          fullName: tc.teacher.fullName,
          email: tc.teacher.email
        }))
      }))
    }))


    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let existedStudent = await this.studentRepo.findOne({
      where: { id },
      relations: {
        courses: {
          course: {
            teachers: {
              teacher: true
            }
          }
        }
      }
    })

    if (!existedStudent) {
      throw new NotFoundException(`The student with this ${id} is not found`)
    }

    let data = {
      id: existedStudent.id,
      email: existedStudent.email,
      fullName: existedStudent.fullName,
      courses: existedStudent.courses.map(sc => ({
        id: sc.course.id,
        title: sc.course.title,
        description: sc.course.description,
        teachers: sc.course.teachers.map(tc => ({
          id: tc.teacher.id,
          fullName: tc.teacher.fullName,
          email: tc.teacher.email
        }))
      }))
    }

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<ISuccess> {
    let updatedStudent = await handleEnrollmentUpdate(id, updateStudentDto, {
      mainRepo: this.studentRepo,
      courseRepo: this.courseRepo,
      enrollmentRepo: this.studentCourseRepo,
      enrollmentKey: "student"
    })

    updatedStudent = await this.studentRepo.findOne({
      where: { id },
      relations: {
        courses: {
          course: {
            teachers: {
              teacher: true
            }
          }
        }
      }
    })

    let data = {
      id: updatedStudent.id,
      fullName: updatedStudent.fullName,
      email: updatedStudent.email,
      course: updatedStudent.courses.map(cr => ({
        id: cr.course.id,
        title: cr.course.title,
        teachers: cr.course.teachers.map(tc => ({
          id: tc.teacher.id,
          fullName: tc.teacher.fullName,
          email: tc.teacher.email
        }))
      }))
    }
    return {
      statusCode: 200,
      message: "updated",
      data
    }
  }

  async remove(id: number): Promise<ISuccess> {
    return await remover(id, this.studentRepo)
  }
}
