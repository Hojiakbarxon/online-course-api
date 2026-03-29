import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVideoDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    orderIndex: number

    @IsNumber()
    @IsNotEmpty()
    duration: number

    @IsString()
    @IsNotEmpty()
    videoUrl: string

    @IsNumber()
    @IsNotEmpty()
    lessonId: number

    @IsNumber()
    @IsNotEmpty()
    teacherId: number
}
