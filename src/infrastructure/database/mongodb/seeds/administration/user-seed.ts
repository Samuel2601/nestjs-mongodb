import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from '../../../../../domain/entities/administration/user.entity';
import * as bcrypt from 'bcrypt';
import {RoleSeed} from './role-seed';

/**
 * Seeder para inicializar usuarios en MongoDB
 */
@Injectable()
export class UserSeed {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		private readonly roleSeed: RoleSeed,
	) {}

	/**
	 * Ejecuta el seeder, creando usuarios base si no existen
	 */
	async seed(): Promise<void> {
		const count = await this.userModel.countDocuments();

		// Solo creamos usuarios si no existen
		if (count === 0) {
			console.log('Creando usuarios iniciales...');

			// Obtener roles que necesitamos para asignar a usuarios
			const adminRole = await this.roleSeed.getRoleByName('admin');
			const userManagerRole = await this.roleSeed.getRoleByName('user-manager');
			const businessManagerRole = await this.roleSeed.getRoleByName('business-manager');
			const dataManagerRole = await this.roleSeed.getRoleByName('data-manager');
			const userRole = await this.roleSeed.getRoleByName('user');
			const viewerRole = await this.roleSeed.getRoleByName('viewer');

			if (!adminRole) {
				console.error('No se encontró el rol "admin". Asegúrate de ejecutar primero el seeder de roles.');
				return;
			}

			// Hash para contraseñas (en producción usar variables de entorno)
			const defaultPassword = await this.hashPassword('Admin123!');
			const regularPassword = await this.hashPassword('User123!');

			// Usuarios iniciales
			const users = [
				{
					username: 'admin',
					email: 'admin@example.com',
					password: defaultPassword,
					firstName: 'Administrador',
					lastName: 'Sistema',
					isActive: true,
					isEmailVerified: true,
					roleIds: [adminRole.id || adminRole.id],
					authMethod: 'local',
					createdAt: new Date(),
				},
				{
					username: 'user_manager',
					email: 'users@example.com',
					password: regularPassword,
					firstName: 'Gestor',
					lastName: 'Usuarios',
					isActive: true,
					isEmailVerified: true,
					roleIds: [userManagerRole ? userManagerRole.id || userManagerRole.id : null].filter(Boolean),
					authMethod: 'local',
					createdAt: new Date(),
				},
				{
					username: 'business_manager',
					email: 'business@example.com',
					password: regularPassword,
					firstName: 'Gestor',
					lastName: 'Empresas',
					isActive: true,
					isEmailVerified: true,
					roleIds: [businessManagerRole ? businessManagerRole.id || businessManagerRole.id : null].filter(Boolean),
					authMethod: 'local',
					createdAt: new Date(),
				},
				{
					username: 'data_manager',
					email: 'data@example.com',
					password: regularPassword,
					firstName: 'Gestor',
					lastName: 'Datos',
					isActive: true,
					isEmailVerified: true,
					roleIds: [dataManagerRole ? dataManagerRole.id || dataManagerRole.id : null].filter(Boolean),
					authMethod: 'local',
					createdAt: new Date(),
				},
				{
					username: 'user',
					email: 'user@example.com',
					password: regularPassword,
					firstName: 'Usuario',
					lastName: 'Estándar',
					isActive: true,
					isEmailVerified: true,
					roleIds: [userRole ? userRole.id || userRole.id : null].filter(Boolean),
					authMethod: 'local',
					createdAt: new Date(),
				},
				{
					username: 'viewer',
					email: 'viewer@example.com',
					password: regularPassword,
					firstName: 'Usuario',
					lastName: 'Visualizador',
					isActive: true,
					isEmailVerified: true,
					roleIds: [viewerRole ? viewerRole.id || viewerRole.id : null].filter(Boolean),
					authMethod: 'local',
					createdAt: new Date(),
				},
			];

			// Crear usuarios filtrados (para no crear usuarios con roles inexistentes)
			const validUsers = users.filter((user) => user.roleIds.length > 0);
			await this.userModel.insertMany(validUsers);

			console.log(`Se crearon ${validUsers.length} usuarios iniciales`);
		} else {
			console.log(`Ya existen ${count} usuarios en la base de datos. Omitiendo seed.`);
		}
	}

	/**
	 * Genera un hash para la contraseña
	 * @param password Contraseña en texto plano
	 * @returns Contraseña hasheada
	 */
	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}
}
