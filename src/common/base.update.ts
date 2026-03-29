import { ConflictException, NotFoundException } from "@nestjs/common";
import { Course } from "src/courses/entities/course.entity";
import { ISuccess } from "src/interfaces/success-response.interface";
import { Repository } from "typeorm";

// enrollment-update.helper.ts
export async function handleEnrollmentUpdate(
    id: number,
    dto: { email?: string; fullName?: string; courseId?: number[] },
    repos: {
        mainRepo: Repository<any>,
        courseRepo: Repository<Course>,
        enrollmentRepo: Repository<any>,
        enrollmentKey: 'teacher' | 'student'
    }
) {
    const { mainRepo, courseRepo, enrollmentRepo, enrollmentKey } = repos
    let { email, fullName, courseId } = dto
    //id checker
    let existed = await mainRepo.findOne({ where: { id }, relations: { courses: { course: true } } })
    if (!existed) {
        throw new NotFoundException(`Entity with id ${id} not found`)
    }

    //email conflict
    if (email) {
        let conflictEmail = await mainRepo.findOneBy({ email })
        if (conflictEmail) {
            if (conflictEmail.id !== id) {
                throw new ConflictException(`The entity with this ${email} email already exists`)
            }
        }
    }

    //course existance

    if (courseId) {
        for (let id of courseId) {
            let course = await courseRepo.findOneBy({ id })
            if (!course) {
                throw new NotFoundException(`The course with this ${id} is not found`)
            }
        }
    }

    //update basic infos
    await mainRepo.update(id, { fullName, email })

    //course enrollment settings
    if (courseId) {
        if (courseId.length > 0) {
            await enrollmentRepo.delete({ [enrollmentKey]: { id } })
            for (let cId of courseId) {
                let course = await courseRepo.findOneBy({ id: cId }) as Course
                let enrollment = await enrollmentRepo.create({
                    [enrollmentKey]: existed,
                    course: course
                })
                await enrollmentRepo.save(enrollment)
            }
        }
    }

    existed = await mainRepo.findOne({ where: { id } })
    return existed
}
export async function remover(id: number, repo: Repository<any>): Promise<ISuccess> {
    let existedstudent = await repo.findOneBy({ id })
    if (!existedstudent) {
        throw new NotFoundException(`The entity with this ${id} id is not found`)
    }

    await repo.delete({ id })

    return {
        statusCode: 200,
        message: 'success',
        data: {}
    }
}