import {registerAs} from '@nestjs/config';

export default registerAs('auth', () => ({
	// Configuración para Google OAuth
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackUrl: process.env.GOOGLE_CALLBACK_URL,
	},

	// Configuración para Facebook OAuth
	facebook: {
		clientId: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
	},

	// Configuración para Microsoft OAuth
	microsoft: {
		clientId: process.env.MICROSOFT_CLIENT_ID,
		clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
		callbackUrl: process.env.MICROSOFT_CALLBACK_URL,
	},

	// Configuración para Apple OAuth
	apple: {
		clientId: process.env.APPLE_CLIENT_ID,
		teamId: process.env.APPLE_TEAM_ID,
		keyId: process.env.APPLE_KEY_ID,
		privateKey: process.env.APPLE_PRIVATE_KEY,
		callbackUrl: process.env.APPLE_CALLBACK_URL,
	},
}));
