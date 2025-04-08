import {registerAs} from '@nestjs/config';

export default registerAs('jwt', () => ({
	secret: process.env.JWT_SECRET,
	expiresIn: process.env.JWT_EXPIRES_IN || '1d',
	refreshSecret: process.env.JWT_REFRESH_SECRET,
	refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
	audience: process.env.JWT_AUDIENCE,
	issuer: process.env.JWT_ISSUER,
}));
