import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Permission} from 'src/domain/entities/administration/permission-entity';

/**
 * Seeder para inicializar permisos en MongoDB
 */
@Injectable()
export class PermissionSeed {
	constructor(@InjectModel('Permission') private readonly permissionModel: Model<Permission>) {}

	/**
	 * Ejecuta el seeder, creando permisos base si no existen
	 */
	async seed(): Promise<void> {
		const count = await this.permissionModel.countDocuments();

		// Solo creamos permisos si no existen
		if (count === 0) {
			console.log('Creando permisos iniciales...');

			// Define los permisos por grupo para una mejor organización
			const permissionGroups = {
				// Grupo de usuarios
				users: [
					{name: 'Ver usuarios', key: 'users:read', description: 'Permite ver la lista de usuarios y detalles'},
					{name: 'Crear usuarios', key: 'users:create', description: 'Permite crear nuevos usuarios'},
					{name: 'Actualizar usuarios', key: 'users:update', description: 'Permite modificar datos de usuarios'},
					{name: 'Eliminar usuarios', key: 'users:delete', description: 'Permite eliminar usuarios'},
				],

				// Grupo de roles
				roles: [
					{name: 'Ver roles', key: 'roles:read', description: 'Permite ver la lista de roles y detalles'},
					{name: 'Crear roles', key: 'roles:create', description: 'Permite crear nuevos roles'},
					{name: 'Actualizar roles', key: 'roles:update', description: 'Permite modificar roles'},
					{name: 'Eliminar roles', key: 'roles:delete', description: 'Permite eliminar roles'},
				],

				// Grupo de permisos
				permissions: [
					{name: 'Ver permisos', key: 'permissions:read', description: 'Permite ver la lista de permisos'},
					{name: 'Crear permisos', key: 'permissions:create', description: 'Permite crear nuevos permisos'},
					{name: 'Actualizar permisos', key: 'permissions:update', description: 'Permite modificar permisos existentes'},
					{name: 'Eliminar permisos', key: 'permissions:delete', description: 'Permite eliminar permisos del sistema'},
					{name: 'Asignar permisos', key: 'permissions:assign', description: 'Permite asignar permisos a roles'},
				],

				// Grupo de personas
				persons: [
					{name: 'Ver personas', key: 'persons:read', description: 'Permite ver la lista de personas y detalles'},
					{name: 'Crear personas', key: 'persons:create', description: 'Permite crear nuevas personas'},
					{name: 'Actualizar personas', key: 'persons:update', description: 'Permite modificar datos de personas'},
					{name: 'Eliminar personas', key: 'persons:delete', description: 'Permite eliminar personas'},
				],

				// Grupo de empresas
				businesses: [
					{name: 'Ver empresas', key: 'businesses:read', description: 'Permite ver la lista de empresas y detalles'},
					{name: 'Crear empresas', key: 'businesses:create', description: 'Permite crear nuevas empresas'},
					{name: 'Actualizar empresas', key: 'businesses:update', description: 'Permite modificar datos de empresas'},
					{name: 'Eliminar empresas', key: 'businesses:delete', description: 'Permite eliminar empresas'},
				],

				// Grupo de sistema
				system: [
					{name: 'Ver configuración', key: 'system:read', description: 'Permite ver configuración del sistema'},
					{name: 'Actualizar configuración', key: 'system:update', description: 'Permite modificar configuración del sistema'},
					{name: 'Ver logs', key: 'system:logs', description: 'Permite ver los logs del sistema'},
					{name: 'Realizar backups', key: 'system:backup', description: 'Permite realizar y restaurar backups'},
				],
			};

			// Prepara todos los permisos en un solo array y añade metadatos
			const permissions = [];

			for (const [group, permissionList] of Object.entries(permissionGroups)) {
				for (const permission of permissionList) {
					permissions.push({
						...permission,
						group,
						isActive: true,
						isSystem: true, // Los permisos iniciales son de sistema
						createdAt: new Date(),
					});
				}
			}

			// Crear permisos en MongoDB
			await this.permissionModel.insertMany(permissions);
			console.log(`Se crearon ${permissions.length} permisos iniciales en ${Object.keys(permissionGroups).length} grupos`);
		} else {
			console.log(`Ya existen ${count} permisos en la base de datos. Omitiendo seed.`);
		}
	}

	/**
	 * Obtiene todos los permisos para utilizarlos en otros seeders
	 */
	async getPermissions(): Promise<Permission[]> {
		return this.permissionModel.find().exec();
	}

	/**
	 * Obtiene permisos por sus claves
	 * @param keys Claves de los permisos a obtener
	 */
	async getPermissionsByKeys(keys: string[]): Promise<Permission[]> {
		return this.permissionModel.find({key: {$in: keys}}).exec();
	}
}
