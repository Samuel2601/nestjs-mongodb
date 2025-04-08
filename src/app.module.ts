import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {ThrottlerModule, ThrottlerModuleOptions} from '@nestjs/throttler';
import {ScheduleModule} from '@nestjs/schedule';
import {BullModule} from '@nestjs/bull';
import {EventEmitterModule} from '@nestjs/event-emitter';

import {DatabaseModule} from './infrastructure/database/database.module';
import {AuthModule} from './modules/auth/auth.module';
import {AdministrationModule} from './modules/administration/administration.module';
import {GeneralModule} from './modules/general/general.module';
import {MonitoringModule} from './modules/monitoring/monitoring.module';
import {I18nModule} from './modules/i18n/i18n.module';
import {WebsocketsModule} from './modules/websockets/websockets.module';

// Guards
import {ThrottlerGuard} from '@nestjs/throttler';

//validación de variables de entorno
import {envValidationSchema} from './config/env/env.validation';

// Configuración
import appConfig from './config/app-config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import authConfig from './config/auth.config';
import redisConfig from './config/redis.config';
import i18nConfig from './config/i18n.config';
import sentryConfig from './config/sentry.config';

@Module({
	imports: [
		// Configuración
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			load: [appConfig, databaseConfig, jwtConfig, authConfig, redisConfig, i18nConfig, sentryConfig],
			expandVariables: true,
			cache: true,
		}),

		// Protección contra ataques de fuerza bruta
		// Rate limiting
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
				throttlers: [
					{
						ttl: configService.get<number>('app.throttle.ttl'),
						limit: configService.get<number>('app.throttle.limit'),
					},
				],
			}),
		}),

		// Conexión a MongoDB
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('database.mongodb.uri'),
				useNewUrlParser: configService.get<boolean>('database.mongodb.useNewUrlParser'),
				useUnifiedTopology: configService.get<boolean>('database.mongodb.useUnifiedTopology'),
			}),
			inject: [ConfigService],
		}),

		// Tareas programadas
		ScheduleModule.forRoot(),

		// Colas de trabajos
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				redis: {
					host: configService.get<string>('redis.host', 'localhost'),
					port: configService.get<number>('redis.port', 6379),
					password: configService.get<string>('redis.password', ''),
				},
			}),
		}),

		// Manejador de eventos
		EventEmitterModule.forRoot(),

		// Módulos de la aplicación
		DatabaseModule,
		AuthModule,
		AdministrationModule,
		GeneralModule,
		MonitoringModule,
		I18nModule,
		WebsocketsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
