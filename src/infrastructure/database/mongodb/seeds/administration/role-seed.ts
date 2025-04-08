import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Role} from 'src/domain/entities/administration/role-entity';
import {PermissionSeed} from './permission-seed';

/**
 * Seeder para inicializar roles en MongoDB
 */
@Injectable()
export class RoleSeed {
	constructor(
		@InjectModel('Role') private readonly roleModel: Model<Role>,
		private readonly permissionSeed: PermissionSeed,
	) {}

	/**
	 * Ejecuta el seeder, creando roles base si no existen
	 */
	async seed(): Promise<void> {
		const count = await this.roleModel.countDocuments();

		// Solo creamos roles si no existen
		if (count === 0) {
			console.log('Creando roles iniciales...');

			// Definición de roles y sus permisos asociados
			const rolesDefinition = [
				{
					name: 'admin',
					description: 'Acceso completo al sistema',
					isSystem: true,
					permissionKeys: [
						// Todos los permisos disponibles
						'users:read',
						'users:create',
						'users:update',
						'users:delete',
						'roles:read',
						'roles:create',
						'roles:update',
						'roles:delete',
						'permissions:read',
						'permissions:create',
						'permissions:update',
						'permissions:delete',
						'permissions:assign',
						'persons:read',
						'persons:create',
						'persons:update',
						'persons:delete',
						'businesses:read',
						'businesses:create',
						'businesses:update',
						'businesses:delete',
						'system:read',
						'system:update',
						'system:logs',
						'system:backup',
					],
				},
				{
					name: 'user-manager',
					description: 'Administra usuarios pero no puede modificar roles ni permisos',
					isSystem: true,
					permissionKeys: ['users:read', 'users:create', 'users:update', 'roles:read', 'permissions:read'],
				},
				{
					name: 'business-manager',
					description: 'Administra empresas',
					isSystem: true,
					permissionKeys: [
						'businesses:read',
						'businesses:create',
						'businesses:update',
						'persons:read', // Necesario para asociar contactos a empresas
					],
				},
				{
					name: 'data-manager',
					description: 'Administra personas y empresas',
					isSystem: true,
					permissionKeys: ['persons:read', 'persons:create', 'persons:update', 'businesses:read', 'businesses:create', 'businesses:update'],
				},
				{
					name: 'user',
					description: 'Usuario estándar con acceso básico al sistema',
					isSystem: true,
					permissionKeys: ['persons:read', 'persons:create', 'persons:update', 'businesses:read'],
				},
				{
					name: 'viewer',
					description: 'Solo puede ver información, sin modificar',
					isSystem: true,
					permissionKeys: ['users:read', 'roles:read', 'permissions:read', 'persons:read', 'businesses:read', 'system:read', 'system:logs'],
				},
			];

			// Procesar cada rol y sus permisos
			for (const roleDef of rolesDefinition) {
				// Obtener los IDs de los permisos asociados a este rol
				const permissions = await this.permissionSeed.getPermissionsByKeys(roleDef.permissionKeys);
				const permissionIds = permissions.map((p) => p.id || p.id);

				// Crear el rol con sus permisos
				await this.roleModel.create({
					name: roleDef.name,
					description: roleDef.description,
					permissionIds: permissionIds,
					isActive: true,
					isSystem: roleDef.isSystem,
					createdAt: new Date(),
				});
			}

			console.log(`Se crearon ${rolesDefinition.length} roles iniciales`);
		} else {
			console.log(`Ya existen ${count} roles en la base de datos. Omitiendo seed.`);
		}
	}

	/**
	 * Obtiene todos los roles para utilizarlos en otros seeders
	 */
	async getRoles(): Promise<Role[]> {
		return this.roleModel.find().exec();
	}

	/**
	 * Obtiene un rol por su nombre
	 * @param name Nombre del rol
	 */
	async getRoleByName(name: string): Promise<Role> {
		return this.roleModel.findOne({name}).exec();
	}
}
