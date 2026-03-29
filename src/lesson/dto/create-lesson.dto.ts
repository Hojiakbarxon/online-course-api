import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title : string

    @IsString()
    @IsOptional()
    description? : string

    @IsNumber()
    @IsNotEmpty()
    orderIndex? : number

    @IsNumber()
    @IsNotEmpty()
    courseId : number

    @IsNumber()
    @IsNotEmpty()
    teacherId : number
}
