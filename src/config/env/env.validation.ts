import Joi from 'joi';

export const envValidationSchema = Joi.object({
	// Servidor
	NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
	PORT: Joi.number().default(3000),
	API_PREFIX: Joi.string().default('api'),

	// MongoDB
	MONGODB_URI: Joi.string().required(),

	// JWT
	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().default('1d'),
	JWT_REFRESH_SECRET: Joi.string().required(),
	JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

	// Redis
	REDIS_HOST: Joi.string().default('localhost'),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_PASSWORD: Joi.string().allow('').default(''),

	// Control de tasa de peticiones
	THROTTLE_TTL: Joi.number().default(60),
	THROTTLE_LIMIT: Joi.number().default(10),

	// Autenticación externa
	GOOGLE_CLIENT_ID: Joi.string().optional(),
	GOOGLE_CLIENT_SECRET: Joi.string().optional(),
	GOOGLE_CALLBACK_URL: Joi.string().optional(),

	FACEBOOK_APP_ID: Joi.string().optional(),
	FACEBOOK_APP_SECRET: Joi.string().optional(),
	FACEBOOK_CALLBACK_URL: Joi.string().optional(),

	MICROSOFT_CLIENT_ID: Joi.string().optional(),
	MICROSOFT_CLIENT_SECRET: Joi.string().optional(),
	MICROSOFT_CALLBACK_URL: Joi.string().optional(),

	APPLE_CLIENT_ID: Joi.string().optional(),
	APPLE_TEAM_ID: Joi.string().optional(),
	APPLE_KEY_ID: Joi.string().optional(),
	APPLE_PRIVATE_KEY: Joi.string().optional(),
	APPLE_CALLBACK_URL: Joi.string().optional(),

	// Servicios de almacenamiento
	STORAGE_TYPE: Joi.string().valid('local', 's3').default('local'),
	S3_ACCESS_KEY: Joi.string().when('STORAGE_TYPE', {
		is: 's3',
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	S3_SECRET_KEY: Joi.string().when('STORAGE_TYPE', {
		is: 's3',
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	S3_BUCKET: Joi.string().when('STORAGE_TYPE', {
		is: 's3',
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	S3_REGION: Joi.string().when('STORAGE_TYPE', {
		is: 's3',
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),

	// Email
	MAIL_HOST: Joi.string().optional(),
	MAIL_PORT: Joi.number().optional(),
	MAIL_USER: Joi.string().optional(),
	MAIL_PASS: Joi.string().optional(),
	MAIL_FROM: Joi.string().optional(),

	// Monitoreo
	SENTRY_DSN: Joi.string().optional(),

	// Servicios de IA
	OPENAI_API_KEY: Joi.string().optional(),
	ANTHROPIC_API_KEY: Joi.string().optional(),
});
