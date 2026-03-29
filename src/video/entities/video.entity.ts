import { BaseEntity } from "src/common/base.entity";
import { Lesson } from "src/lesson/entities/lesson.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity("video")
export class Video extends BaseEntity {
    @Column({ type: "varchar" })
    title: string

    @Column({ type: "integer", default: 0 })
    orderIndex: number

    @Column({ type: "integer" })
    duration: number

    @Column({ type: 'varchar' })
    videoUrl: string

    @ManyToOne(() => Lesson, (ls) => ls.videos, {
        onDelete: "CASCADE"
    })
    lesson: Lesson
}