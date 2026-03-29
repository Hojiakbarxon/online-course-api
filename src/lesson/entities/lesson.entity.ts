import { BaseEntity } from "src/common/base.entity";
import { Course } from "src/courses/entities/course.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Video } from "src/video/entities/video.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity("lesson")
export class Lesson extends BaseEntity {
    @Column({ type: "varchar" })
    title: string

    @Column({ type: "varchar", nullable: true })
    description: string

    @Column({ type: "integer", default: 0 })
    orderIndex: number

    @ManyToOne(() => Course, (c) => c.lessons, {
        onDelete: "CASCADE"
    })
    course: Course

    @ManyToOne(() => Teacher, (tc) => tc.lessons, {
        onDelete: 'CASCADE'
    })
    teacher: Teacher

    @OneToMany(() => Video, (vd) => vd.lesson)
    videos: Video[]
}
