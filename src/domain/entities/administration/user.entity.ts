import {Types} from 'mongoose';

/**
 * Entidad de dominio para Usuario
 * Esta es la entidad principal de dominio, independiente de la implementación
 * de infraestructura como MongoDB
 */
export class User {
	id?: string | Types.ObjectId;

	/**
	 * Correo electrónico del usuario
	 */
	email: string;

	/**
	 * Nombre de usuario
	 */
	username: string;

	/**
	 * Contraseña (hash)
	 */
	password?: string;

	/**
	 * Referencia a la persona asociada
	 */
	personId?: string | Types.ObjectId;

	/**
	 * Roles asignados al usuario
	 */
	roleIds: (string | Types.ObjectId)[];

	/**
	 * Si el usuario está activo
	 */
	isActive: boolean;

	/**
	 * Si el correo ha sido verificado
	 */
	isEmailVerified: boolean;

	/**
	 * Token para verificación de correo
	 */
	emailVerificationToken?: string;

	/**
	 * Token para restablecimiento de contraseña
	 */
	passwordResetToken?: string;

	/**
	 * Fecha de expiración del token de restablecimiento
	 */
	passwordResetExpires?: Date;

	/**
	 * Fecha del último inicio de sesión
	 */
	lastLogin?: Date;

	/**
	 * Método de autenticación preferido
	 */
	authMethod?: 'local' | 'google' | 'facebook' | 'apple' | 'microsoft';

	/**
	 * Datos de autenticación externa
	 */
	externalAuth?: {
		provider: string;
		providerId: string;
	};

	/**
	 * Fecha de creación
	 */
	createdAt?: Date;

	/**
	 * Fecha de última actualización
	 */
	updatedAt?: Date;
}
