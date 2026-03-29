import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { TeacherCourse } from "./teacher_course.entity";
import { Lesson } from "src/lesson/entities/lesson.entity";

@Entity("teacher")
export class Teacher extends BaseEntity {
    @Column({ type: "varchar" })
    fullName: string;

    @Column({ type: "varchar", unique: true })
    email: string;

    @OneToMany(() => TeacherCourse, (tc) => tc.teacher)
    courses: TeacherCourse[]

    @OneToMany(() => Lesson, (ls) => ls.teacher)
    lessons: Lesson[]
}