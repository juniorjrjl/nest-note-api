import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { InvalidPasswordExceptionFilter } from './filters/invalid-password-exception-filter';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception-filter';
import { NotFoundExceptionFilter } from './filters/not-found-exception-filter';
import { GenericExceptionFilter } from './filters/generic-exception-filter';
import { ValidationError } from 'class-validator';
import { ConstraintInfo, ConstraintViolationException } from './exception';
import { ConstraintViolationExceptionFilter } from './filters/constraint-violation-exception-filter';

function configSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('NestNote-API')
    .setDescription('Available resources in NestNote-API')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Notes')
    .addBearerAuth()
    .build()
  const documentFactory = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(process.env.SWAGGER_PATH ?? 'docs', app, documentFactory)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(
    new GenericExceptionFilter(),
    new InvalidPasswordExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ConstraintViolationExceptionFilter()
  )
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) =>
      new ConstraintViolationException(
        'A requisição contém erros',
        errors.map(e => new ConstraintInfo(e.property, Object.values(e.constraints)))
      )

  }))
  configSwagger(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
