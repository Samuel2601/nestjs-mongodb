import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {TransformInterceptor} from './presentation/interceptors/transform.interceptor';
import {LoggingMiddleware} from './shared/middleware/logger.middleware';
import {ConfigService} from '@nestjs/config';
import {HttpExceptionFilter} from './presentation/filters/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// Configuración global de pipes
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	// Configuración global de filtros
	app.useGlobalFilters(new HttpExceptionFilter());

	// Configuración global de interceptores
	app.useGlobalInterceptors(new TransformInterceptor());

	// Configuración de CORS
	app.enableCors();

	// Configuración de middleware global
	app.use(LoggingMiddleware);

	// Configuración de prefijo global para las rutas
	app.setGlobalPrefix('api');

	// Configuración de Swagger
	const swaggerConfig = new DocumentBuilder().setTitle('API Documentation').setDescription('The API description').setVersion('1.0').addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, document);

	const port = configService.get<number>('PORT') || 3000;
	await app.listen(port);
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
