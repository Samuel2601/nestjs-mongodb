import {registerAs} from '@nestjs/config';

export default registerAs('i18n', () => ({
	defaultLanguage: process.env.I18N_DEFAULT_LANGUAGE || 'es',
	fallbackLanguage: process.env.I18N_FALLBACK_LANGUAGE || 'en',
	supportedLanguages: (process.env.I18N_SUPPORTED_LANGUAGES || 'es,en').split(','),
	path: process.env.I18N_PATH || 'src/infrastructure/services/i18n/messages',
	filePattern: process.env.I18N_FILE_PATTERN || '*.json',
	globalCatalog: process.env.I18N_GLOBAL_CATALOG === 'true',
	// Opciones para i18next
	detectLanguageHeader: true,
	detectLanguageQueryParam: 'lang',
	detectLanguageCookie: 'lang',
}));
