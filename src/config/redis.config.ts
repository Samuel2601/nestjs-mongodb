import {registerAs} from '@nestjs/config';

export default registerAs('redis', () => ({
	host: process.env.REDIS_HOST || 'localhost',
	port: parseInt(process.env.REDIS_PORT || '6379', 10),
	password: process.env.REDIS_PASSWORD || '',
	db: parseInt(process.env.REDIS_DB || '0', 10),
	keyPrefix: process.env.REDIS_KEY_PREFIX || '',
	// Configuración de TTL (Time To Live) para caché
	ttl: parseInt(process.env.REDIS_CACHE_TTL || '3600', 10), // 1 hora por defecto
}));
