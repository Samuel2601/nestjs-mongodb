import {Types} from 'mongoose';
import {User} from '../../entities/administration/user.entity';

/**
 * Interfaz del repositorio de Usuario
 * Define los métodos específicos para operaciones con usuarios
 */
export abstract class UserRepository {
	/**
	 * Encuentra un usuario por correo electrónico
	 * @param email Correo electrónico del usuario
	 * @returns Usuario encontrado o null
	 */
	abstract findByEmail(email: string): Promise<User | null>;

	/**
	 * Encuentra un usuario por nombre de usuario
	 * @param username Nombre de usuario
	 * @returns Usuario encontrado o null
	 */
	abstract findByUsername(username: string): Promise<User | null>;

	/**
	 * Verifica si un correo electrónico ya existe
	 * @param email Correo electrónico a verificar
	 * @returns true si existe, false en caso contrario
	 */
	abstract emailExists(email: string): Promise<boolean>;

	/**
	 * Verifica si un nombre de usuario ya existe
	 * @param username Nombre de usuario a verificar
	 * @returns true si existe, false en caso contrario
	 */
	abstract usernameExists(username: string): Promise<boolean>;

	/**
	 * Encuentra usuarios por sus roles
	 * @param roleIds IDs de roles
	 * @returns Lista de usuarios con esos roles
	 */
	abstract findByRoles(roleIds: (string | Types.ObjectId)[]): Promise<User[]>;

	/**
	 * Actualiza la fecha del último inicio de sesión
	 * @param userId ID del usuario
	 * @param date Fecha del último inicio de sesión
	 * @returns Usuario actualizado
	 */
	abstract updateLastLogin(userId: string | Types.ObjectId, date: Date): Promise<User | null>;

	/**
	 * Actualiza los roles de un usuario
	 * @param userId ID del usuario
	 * @param roleIds IDs de roles
	 * @returns Usuario actualizado
	 */
	abstract updateRoles(userId: string | Types.ObjectId, roleIds: (string | Types.ObjectId)[]): Promise<User | null>;

	/**
	 * Activa o desactiva un usuario
	 * @param userId ID del usuario
	 * @param isActive Estado de activación
	 * @returns Usuario actualizado
	 */
	abstract setActiveStatus(userId: string | Types.ObjectId, isActive: boolean): Promise<User | null>;

	/**
	 * Establece el estado de verificación de correo
	 * @param userId ID del usuario
	 * @param isVerified Estado de verificación
	 * @returns Usuario actualizado
	 */
	abstract setEmailVerified(userId: string | Types.ObjectId, isVerified: boolean): Promise<User | null>;

	/**
	 * Guarda un token de recuperación de contraseña
	 * @param email Correo electrónico del usuario
	 * @param token Token de recuperación
	 * @param expires Fecha de expiración
	 * @returns Usuario actualizado
	 */
	abstract savePasswordResetToken(email: string, token: string, expires: Date): Promise<User | null>;

	/**
	 * Busca un usuario por su token de restablecimiento
	 * @param token Token de restablecimiento
	 * @returns Usuario encontrado o null
	 */
	abstract findByResetToken(token: string): Promise<User | null>;

	/**
	 * Actualiza la contraseña de un usuario
	 * @param userId ID del usuario
	 * @param newPassword Nueva contraseña (sin hashear)
	 * @returns Usuario actualizado
	 */
	abstract updatePassword(userId: string | Types.ObjectId, newPassword: string): Promise<User | null>;

	/**
	 * Métodos básicos CRUD
	 */
	abstract create(user: Partial<User>, session?: any): Promise<User>;
	abstract findById(id: string | Types.ObjectId): Promise<User | null>;
	abstract find(filter?: any): Promise<User[]>;
	abstract update(id: string | Types.ObjectId, user: Partial<User>, session?: any): Promise<User | null>;
	abstract delete(id: string | Types.ObjectId, session?: any): Promise<User | null>;
	abstract findPaginated(filter: any, page: number, limit: number): Promise<{data: User[]; total: number; page: number; limit: number; totalPages: number}>;
}
