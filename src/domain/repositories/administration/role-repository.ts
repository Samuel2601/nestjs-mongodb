import {Types} from 'mongoose';
import {Role} from 'src/domain/entities/administration/role-entity';

/**
 * Interfaz del repositorio de Rol
 * Define los métodos específicos para operaciones con roles
 */
export abstract class RoleRepository {
	/**
	 * Encuentra un rol por su nombre
	 * @param name Nombre del rol
	 * @returns Rol encontrado o null
	 */
	abstract findByName(name: string): Promise<Role | null>;

	/**
	 * Verifica si un nombre de rol ya existe
	 * @param name Nombre a verificar
	 * @returns true si existe, false en caso contrario
	 */
	abstract nameExists(name: string): Promise<boolean>;

	/**
	 * Encuentra roles con permisos específicos
	 * @param permissionId ID del permiso
	 * @returns Lista de roles con ese permiso
	 */
	abstract findByPermission(permissionId: string | Types.ObjectId): Promise<Role[]>;

	/**
	 * Actualiza los permisos de un rol
	 * @param roleId ID del rol
	 * @param permissionIds IDs de permisos
	 * @returns Rol actualizado
	 */
	abstract updatePermissions(roleId: string | Types.ObjectId, permissionIds: (string | Types.ObjectId)[], session?: any): Promise<Role | null>;

	/**
	 * Encuentra todos los roles de sistema
	 * @returns Lista de roles de sistema
	 */
	abstract findSystemRoles(): Promise<Role[]>;

	/**
	 * Verifica si un rol puede ser modificado (no es de sistema)
	 * @param roleId ID del rol
	 * @returns true si puede ser modificado, false en caso contrario
	 */
	abstract canBeModified(roleId: string | Types.ObjectId): Promise<boolean>;

	/**
	 * Métodos básicos CRUD
	 */
	abstract create(role: Partial<Role>, session?: any): Promise<Role>;
	abstract findById(id: string | Types.ObjectId): Promise<Role | null>;
	abstract find(filter?: any): Promise<Role[]>;
	abstract update(id: string | Types.ObjectId, role: Partial<Role>, session?: any): Promise<Role | null>;
	abstract delete(id: string | Types.ObjectId, session?: any): Promise<Role | null>;
	abstract findPaginated(filter: any, page: number, limit: number): Promise<{data: Role[]; total: number; page: number; limit: number; totalPages: number}>;
}
