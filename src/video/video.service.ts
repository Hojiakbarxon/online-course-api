import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { ISuccess } from 'src/interfaces/success-response.interface';
import { remover } from 'src/common/base.update';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private readonly videoRepo: Repository<Video>,
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>
  ) { }

  async create(createVideoDto: CreateVideoDto): Promise<ISuccess> {
    let { lessonId, teacherId } = createVideoDto

    let availableLesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: {
        teacher: true
      }
    })

    if (!availableLesson) {
      throw new NotFoundException(`The lesson is not found`)
    }

    let availableTeacher = await this.teacherRepo.findOneBy({ id: teacherId })
    if (!availableTeacher) {
      throw new NotFoundException(`The teacher with this ${teacherId} id is not found`)
    }

    if (availableLesson.teacher.id !== teacherId) {
      throw new ForbiddenException(`You do not belong to this lesson`)
    }

    let newVideo = this.videoRepo.create({
      ...createVideoDto,
      lesson: availableLesson
    })

    await this.videoRepo.save(newVideo)

    let data = {
      id: newVideo.id,
      title: newVideo.title,
      videoUrl: newVideo.videoUrl,
      orderIndex: newVideo.orderIndex,
      lesson: {
        id: availableLesson.id,
        title: availableLesson.title,
        teacher: {
          fullName: availableLesson.teacher.fullName,
          email: availableLesson.teacher.email
        }
      }
    }

    return {
      statusCode: 201,
      message: "created",
      data
    }
  }

  async findAll(): Promise<ISuccess> {
    let videos = await this.videoRepo.find({
      relations: {
        lesson: {
          teacher: true,
          course: true
        }
      },
      order: { orderIndex: 'ASC' }
    })

    let data = videos.map(v => ({
      id: v.id,
      title: v.title,
      videoUrl: v.videoUrl,
      duration: v.duration,
      orderIndex: v.orderIndex,
      lesson: {
        id: v.lesson.id,
        title: v.lesson.title,
        course: {
          id: v.lesson.course.id,
          title: v.lesson.course.title
        },
        teacher: {
          fullName: v.lesson.teacher.fullName,
          email: v.lesson.teacher.email
        }
      }
    }))

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let video = await this.videoRepo.findOne({
      where: { id },
      relations: {
        lesson: {
          teacher: true,
          course: true
        }
      }
    })

    if (!video) {
      throw new NotFoundException(`Video with id ${id} not found`)
    }

    let data = {
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl,
      duration: video.duration,
      orderIndex: video.orderIndex,
      lesson: {
        id: video.lesson.id,
        title: video.lesson.title,
        course: {
          id: video.lesson.course.id,
          title: video.lesson.course.title
        },
        teacher: {
          fullName: video.lesson.teacher.fullName,
          email: video.lesson.teacher.email
        }
      }
    }

    return {
      statusCode: 200,
      message: "success",
      data
    }
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<ISuccess> {
    let { lessonId, teacherId } = updateVideoDto

    let existedVideo = await this.videoRepo.findOne({
      where: { id },
      relations: {
        lesson: {
          course: true,
          teacher: true
        }
      },
    })

    if (!existedVideo) {
      throw new NotFoundException(`The video  is not found`)
    }
    if (lessonId) {
      let existedLesson = await this.lessonRepo.findOne({
        where: { id: lessonId },
        relations: {
          teacher: true
        }
      })

      if (!existedLesson) {
        throw new NotFoundException(`The lesson is not found`)
      }

      if (existedLesson.teacher.id !== teacherId) {
        throw new ForbiddenException(`You do not belong to this lesson`)
      }
      await this.videoRepo.update(id, {
        lesson: existedLesson
      })

    }

    await this.videoRepo.update(id, {
      title: updateVideoDto?.title,
      orderIndex: updateVideoDto?.orderIndex,
      duration: updateVideoDto?.duration,
      videoUrl: updateVideoDto?.videoUrl
    })
    
    let updatedVideo = await this.videoRepo.findOne({
      where: { id },
      relations: {
        lesson: {
          course: true,
          teacher: true
        }
      },
    }) as Video

    let data = {
      id: updatedVideo.id,
      title: updatedVideo.title,
      videoUrl: updatedVideo.videoUrl,
      duration: updatedVideo.duration,
      orderIndex: updatedVideo.orderIndex,
      lesson: {
        id: updatedVideo.lesson.id,
        title: updatedVideo.lesson.title,
        course: {
          id: updatedVideo.lesson.course.id,
          title: updatedVideo.lesson.course.title
        },
        teacher: {
          fullName: updatedVideo.lesson.teacher.fullName,
          email: updatedVideo.lesson.teacher.email
        }
      }
    }

    return {
      statusCode: 200,
      message: "updated",
      data
    }
  }

  async remove(id: number): Promise<ISuccess> {
    return await remover(id, this.videoRepo)
  }
}