import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {ThrottlerModule} from '@nestjs/throttler';
import {ScheduleModule} from '@nestjs/schedule';
import {BullModule} from '@nestjs/bull';
import {EventEmitterModule} from '@nestjs/event-emitter';

import {envValidationSchema} from './config/env/env.validation';
import {DatabaseModule} from './infrastructure/database/database.module';
import {AuthModule} from './modules/auth/auth.module';
import {AdministrationModule} from './modules/administration/administration.module';
import {GeneralModule} from './modules/general/general.module';
import {MonitoringModule} from './modules/monitoring/monitoring.module';
import {I18nModule} from './modules/i18n/i18n.module';
import {WebsocketsModule} from './modules/websockets/websockets.module';

@Module({
	imports: [
		// Configuración
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			cache: true,
		}),

		// Conexión a MongoDB
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}),
			inject: [ConfigService],
		}),

		// Protección contra ataques de fuerza bruta
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				ttl: config.get<number>('THROTTLE_TTL', 60),
				limit: config.get<number>('THROTTLE_LIMIT', 10),
			}),
		}),

		// Tareas programadas
		ScheduleModule.forRoot(),

		// Colas de trabajos
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				redis: {
					host: configService.get<string>('REDIS_HOST', 'localhost'),
					port: configService.get<number>('REDIS_PORT', 6379),
					password: configService.get<string>('REDIS_PASSWORD', ''),
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
