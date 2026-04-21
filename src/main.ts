import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  let port = Number(process.env.PORT)
  const app = await NestFactory.create(AppModule);

  
  app.setGlobalPrefix("api")

  
  const config = new DocumentBuilder()
    .setTitle('Online Course API')
    .setDescription('CRUD API for courses, teachers, students')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  )

  await app.listen(port, () => console.log(`Port is running on port `, port));
}
bootstrap();
