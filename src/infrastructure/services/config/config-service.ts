import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

/**
 * Servicio centralizado para acceder a la configuración de la aplicación
 * Proporciona métodos tipados para acceder a cada sección de configuración
 */
@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService) {}

	/**
	 * Obtiene la configuración de la aplicación
	 */
	get app() {
		return {
			nodeEnv: this.configService.get<string>('app.nodeEnv'),
			name: this.configService.get<string>('app.name'),
			host: this.configService.get<string>('app.host'),
			port: this.configService.get<number>('app.port'),
			apiPrefix: this.configService.get<string>('app.apiPrefix'),
			throttle: {
				ttl: this.configService.get<number>('app.throttle.ttl'),
				limit: this.configService.get<number>('app.throttle.limit'),
			},
			storage: {
				type: this.configService.get<string>('app.storage.type'),
				s3: {
					accessKey: this.configService.get<string>('app.storage.s3.accessKey'),
					secretKey: this.configService.get<string>('app.storage.s3.secretKey'),
					bucket: this.configService.get<string>('app.storage.s3.bucket'),
					region: this.configService.get<string>('app.storage.s3.region'),
				},
			},
			mail: {
				host: this.configService.get<string>('app.mail.host'),
				port: this.configService.get<number>('app.mail.port'),
				user: this.configService.get<string>('app.mail.user'),
				pass: this.configService.get<string>('app.mail.pass'),
				from: this.configService.get<string>('app.mail.from'),
			},
			ai: {
				openai: {
					apiKey: this.configService.get<string>('app.ai.openai.apiKey'),
				},
				anthropic: {
					apiKey: this.configService.get<string>('app.ai.anthropic.apiKey'),
				},
			},
		};
	}

	/**
	 * Obtiene la configuración de la base de datos
	 */
	get database() {
		return {
			mongodb: {
				uri: this.configService.get<string>('database.mongodb.uri'),
				useNewUrlParser: this.configService.get<boolean>('database.mongodb.useNewUrlParser'),
				useUnifiedTopology: this.configService.get<boolean>('database.mongodb.useUnifiedTopology'),
			},
		};
	}

	/**
	 * Obtiene la configuración de JWT
	 */
	get jwt() {
		return {
			secret: this.configService.get<string>('jwt.secret'),
			expiresIn: this.configService.get<string>('jwt.expiresIn'),
			refreshSecret: this.configService.get<string>('jwt.refreshSecret'),
			refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
			audience: this.configService.get<string>('jwt.audience'),
			issuer: this.configService.get<string>('jwt.issuer'),
		};
	}

	/**
	 * Obtiene la configuración de autenticación
	 */
	get auth() {
		return {
			google: {
				clientId: this.configService.get<string>('auth.google.clientId'),
				clientSecret: this.configService.get<string>('auth.google.clientSecret'),
				callbackUrl: this.configService.get<string>('auth.google.callbackUrl'),
			},
			facebook: {
				clientId: this.configService.get<string>('auth.facebook.clientId'),
				clientSecret: this.configService.get<string>('auth.facebook.clientSecret'),
				callbackUrl: this.configService.get<string>('auth.facebook.callbackUrl'),
			},
			microsoft: {
				clientId: this.configService.get<string>('auth.microsoft.clientId'),
				clientSecret: this.configService.get<string>('auth.microsoft.clientSecret'),
				callbackUrl: this.configService.get<string>('auth.microsoft.callbackUrl'),
			},
			apple: {
				clientId: this.configService.get<string>('auth.apple.clientId'),
				teamId: this.configService.get<string>('auth.apple.teamId'),
				keyId: this.configService.get<string>('auth.apple.keyId'),
				privateKey: this.configService.get<string>('auth.apple.privateKey'),
				callbackUrl: this.configService.get<string>('auth.apple.callbackUrl'),
			},
		};
	}

	/**
	 * Obtiene la configuración de Redis
	 */
	get redis() {
		return {
			host: this.configService.get<string>('redis.host'),
			port: this.configService.get<number>('redis.port'),
			password: this.configService.get<string>('redis.password'),
			db: this.configService.get<number>('redis.db'),
			keyPrefix: this.configService.get<string>('redis.keyPrefix'),
			ttl: this.configService.get<number>('redis.ttl'),
		};
	}

	/**
	 * Obtiene la configuración de i18n
	 */
	get i18n() {
		return {
			defaultLanguage: this.configService.get<string>('i18n.defaultLanguage'),
			fallbackLanguage: this.configService.get<string>('i18n.fallbackLanguage'),
			supportedLanguages: this.configService.get<string[]>('i18n.supportedLanguages'),
			path: this.configService.get<string>('i18n.path'),
			filePattern: this.configService.get<string>('i18n.filePattern'),
			globalCatalog: this.configService.get<boolean>('i18n.globalCatalog'),
			detectLanguageHeader: this.configService.get<boolean>('i18n.detectLanguageHeader'),
			detectLanguageQueryParam: this.configService.get<string>('i18n.detectLanguageQueryParam'),
			detectLanguageCookie: this.configService.get<string>('i18n.detectLanguageCookie'),
		};
	}

	/**
	 * Obtiene la configuración de Sentry
	 */
	get sentry() {
		return {
			dsn: this.configService.get<string>('sentry.dsn'),
			debug: this.configService.get<boolean>('sentry.debug'),
			environment: this.configService.get<string>('sentry.environment'),
			release: this.configService.get<string>('sentry.release'),
			tracesSampleRate: this.configService.get<number>('sentry.tracesSampleRate'),
			enabled: this.configService.get<boolean>('sentry.enabled'),
		};
	}

	/**
	 * Obtiene un valor genérico de la configuración
	 * @param key Clave de configuración
	 * @returns Valor de configuración
	 */
	get<T>(key: string): T {
		return this.configService.get<T>(key);
	}
}
