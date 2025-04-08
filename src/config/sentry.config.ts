import {registerAs} from '@nestjs/config';

export default registerAs('sentry', () => ({
	dsn: process.env.SENTRY_DSN,
	debug: process.env.SENTRY_DEBUG === 'true',
	environment: process.env.NODE_ENV || 'development',
	release: process.env.SENTRY_RELEASE || 'v1.0.0',
	tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '1.0'),
	enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'test',
}));
