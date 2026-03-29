<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">Online Course Platform API</h1>

<p align="center">
  A RESTful API for managing online courses, teachers, students, lessons and videos.
  Built with NestJS, TypeORM and PostgreSQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white" />
</p>

---

## Overview

This is a backend API for an online course platform where:

- **Teachers** can create and manage courses, lessons and videos
- **Students** can enroll in multiple courses and access content
- A **course** can have multiple teachers and multiple students
- A **lesson** belongs to one course and is created by one teacher
- A **video** belongs to one lesson and is managed by the lesson's teacher

---

## Data Model
```
Teacher  ←→  Course     (ManyToMany via teacher_course)
Student  ←→  Course     (ManyToMany via student_course)
Course    →  Lesson     (OneToMany)
Teacher   →  Lesson     (OneToMany — lesson creator)
Lesson    →  Video      (OneToMany)
```

### Cascade Delete Chain
```
Delete Course   →  deletes teacher_course, student_course, lessons, videos
Delete Teacher  →  deletes teacher_course, lessons, videos
Delete Student  →  deletes student_course
Delete Lesson   →  deletes videos
```

---

## API Endpoints

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /courses | Get all courses |
| GET | /courses/:id | Get single course |
| POST | /courses | Create a course |
| PATCH | /courses/:id | Update a course |
| DELETE | /courses/:id | Delete a course |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /teachers | Get all teachers |
| GET | /teachers/:id | Get single teacher |
| POST | /teachers | Create a teacher |
| PATCH | /teachers/:id | Update a teacher |
| DELETE | /teachers/:id | Delete a teacher |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | Get all students |
| GET | /students/:id | Get single student |
| POST | /students | Create a student |
| PATCH | /students/:id | Update a student |
| DELETE | /students/:id | Delete a student |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /lesson | Get all lessons |
| GET | /lesson/:id | Get single lesson |
| POST | /lesson | Create a lesson (teacher must belong to course) |
| PATCH | /lesson/:id | Update a lesson |
| DELETE | /lesson/:id | Delete a lesson |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /video | Get all videos |
| GET | /video/:id | Get single video |
| POST | /video | Create a video (teacher must own the lesson) |
| PATCH | /video/:id | Update a video |
| DELETE | /video/:id | Delete a video |

---

## Business Rules

- A teacher can belong to multiple courses
- A student can enroll in multiple courses
- A course can have multiple teachers and multiple students
- Only a teacher who belongs to a course can create lessons in it
- Only the teacher who created a lesson can add or edit videos in it
- Deleting a course removes all its lessons and videos automatically
- Deleting a teacher removes all their lessons and videos automatically

---

## Project Structure
```
src/
├── courses/
│   ├── dto/
│   ├── entities/
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── courses.module.ts
├── teachers/
│   ├── dto/
│   ├── entities/
│   ├── teachers.controller.ts
│   ├── teachers.service.ts
│   └── teachers.module.ts
├── students/
│   ├── dto/
│   ├── entities/
│   ├── students.controller.ts
│   ├── students.service.ts
│   └── students.module.ts
├── lesson/
│   ├── dto/
│   ├── entities/
│   ├── lesson.controller.ts
│   ├── lesson.service.ts
│   └── lesson.module.ts
├── video/
│   ├── dto/
│   ├── entities/
│   ├── video.controller.ts
│   ├── video.service.ts
│   └── video.module.ts
├── common/
│   ├── base.create.dto.ts
│   ├── base.entity.ts
│   └── base.update.ts
├── interfaces/
│   └── success-response.interface.ts
└── main.ts
```

---

## Installation
```bash
# clone the repo
git clone https://github.com/Hojiakbarxon/online-course-api.git
cd online_course

# install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory:
```env
PORT=your_port
DB_URL=postgres://your_username:your_password@localhost:5432/online_course
```

## Running the App
```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

---

## Upcoming Features

- JWT Authentication
- Role-based access control (Teacher / Student)
- Teacher can only edit their own lessons and videos
- Student can only access enrolled courses
