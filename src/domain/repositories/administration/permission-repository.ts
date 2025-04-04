import {Types} from 'mongoose';
import {Permission} from 'src/domain/entities/administration/permission-entity';

/**
 * Interfaz del repositorio de Permiso
 * Define los métodos específicos para operaciones con permisos
 */
export abstract class PermissionRepository {
	/**
	 * Encuentra un permiso por su clave
	 * @param key Clave del permiso
	 * @returns Permiso encontrado o null
	 */
	abstract findByKey(key: string): Promise<Permission | null>;

	/**
	 * Verifica si una clave de permiso ya existe
	 * @param key Clave a verificar
	 * @returns true si existe, false en caso contrario
	 */
	abstract keyExists(key: string): Promise<boolean>;

	/**
	 * Encuentra permisos por grupo
	 * @param group Nombre del grupo
	 * @returns Lista de permisos en ese grupo
	 */
	abstract findByGroup(group: string): Promise<Permission[]>;

	/**
	 * Obtiene todos los grupos de permisos distintos
	 * @returns Lista de nombres de grupos
	 */
	abstract getAllGroups(): Promise<string[]>;

	/**
	 * Encuentra todos los permisos de sistema
	 * @returns Lista de permisos de sistema
	 */
	abstract findSystemPermissions(): Promise<Permission[]>;

	/**
	 * Verifica si un permiso puede ser modificado (no es de sistema)
	 * @param permissionId ID del permiso
	 * @returns true si puede ser modificado, false en caso contrario
	 */
	abstract canBeModified(permissionId: string | Types.ObjectId): Promise<boolean>;

	/**
	 * Encuentra permisos por una lista de IDs
	 * @param ids Lista de IDs de permisos
	 * @returns Lista de permisos encontrados
	 */
	abstract findByIds(ids: (string | Types.ObjectId)[]): Promise<Permission[]>;

	/**
	 * Métodos básicos CRUD
	 */
	abstract create(permission: Partial<Permission>, session?: any): Promise<Permission>;
	abstract findById(id: string | Types.ObjectId): Promise<Permission | null>;
	abstract find(filter?: any): Promise<Permission[]>;
	abstract update(id: string | Types.ObjectId, permission: Partial<Permission>, session?: any): Promise<Permission | null>;
	abstract delete(id: string | Types.ObjectId, session?: any): Promise<Permission | null>;
	abstract findPaginated(filter: any, page: number, limit: number): Promise<{data: Permission[]; total: number; page: number; limit: number; totalPages: number}>;
}
