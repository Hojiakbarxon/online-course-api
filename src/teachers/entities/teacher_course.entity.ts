import { BaseEntity } from "src/common/base.entity";
import { Course } from "src/courses/entities/course.entity";
import { Entity, ManyToOne } from "typeorm";
import { Teacher } from "./teacher.entity";

@Entity("teacher_course")
export class TeacherCourse extends BaseEntity {
    @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
        onDelete: "CASCADE"
    })
    teacher: Teacher

    @ManyToOne(() => Course, (course) => course.teachers, {
        onDelete: "CASCADE"
    })
    course: Course
}