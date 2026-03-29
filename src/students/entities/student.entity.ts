import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { StudentCourse } from "./student-course.entity";

@Entity("student")
export class Student extends BaseEntity{
    @Column({type : "varchar"})
    fullName : string;

    @Column({type : "varchar", unique : true})
    email : string;

    @OneToMany(() => StudentCourse, (sc) => sc.student)
    courses : StudentCourse[]
}
