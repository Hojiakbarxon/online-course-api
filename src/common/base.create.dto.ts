import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BaseDto {
    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsArray()
    @IsOptional()
    courseId: number[]
}