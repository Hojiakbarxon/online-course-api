import { BaseEntity } from "src/common/base.entity";
import { Lesson } from "src/lesson/entities/lesson.entity";
import { StudentCourse } from "src/students/entities/student-course.entity";
import { TeacherCourse } from "src/teachers/entities/teacher_course.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("course")
export class Course extends BaseEntity {
    @Column({ type: "varchar", unique: true })
    title: string;

    @Column({ type: "varchar", nullable: true })
    description: string

    @Column({ type: "varchar" })
    duration: string;

    @OneToMany(() => StudentCourse, (sc) => sc.course)
    students: StudentCourse[]

    @OneToMany(() => TeacherCourse, (tc) => tc.course)
    teachers: TeacherCourse[]

    @OneToMany(() => Lesson, (lc) => lc.course)
    lessons : Lesson[]
}
