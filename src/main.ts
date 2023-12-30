import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppExceptionFilter } from './shared/filters/app-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor())
  const port = configService.get<string>('PORT_SERVER');
  const { DateTime } = require('luxon');
  let d = DateTime.local();
  const timezone = d.zoneName;
  await app.enableCors();
  app.use(json({ limit: '300mb' }));
  const config = new DocumentBuilder()
    .setTitle('Algorand ApiRest')
    .setDescription('Algorand Api Rest V1')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', 
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'access-token',
    ) 
    .build();
  const enviroment = process.env.NODE_ENV || 'dev';
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port, async () => {
    Logger.log(`Enviroment running at ${enviroment}`);
    Logger.log(`Current process env ${enviroment}.env`);
    Logger.log(`Server is running at ${await app.getUrl()}`);
    Logger.log(`Timezone:  ${timezone}`);
  });
}
bootstrap();
