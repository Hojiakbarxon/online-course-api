import { BaseEntity } from "src/common/base.entity";
import { Entity, ManyToOne } from "typeorm";
import { Student } from "./student.entity";
import { Course } from "src/courses/entities/course.entity";

@Entity("student_course")
export class StudentCourse extends BaseEntity{
    @ManyToOne(() => Student, (student) => student.courses, {
        onDelete : "CASCADE"
    })
    student : Student

    @ManyToOne(() => Course, (course) => course.students, {
        onDelete : "CASCADE"
    })
    course : Course
}