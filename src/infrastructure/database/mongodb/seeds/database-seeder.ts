import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PermissionSeed} from './administration/permission-seed';
import {RoleSeed} from './administration/role-seed';
import {UserSeed} from './administration/user-seed';

/**
 * Servicio principal de inicialización de datos
 * Ejecuta todos los seeders en el orden correcto
 */
@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
	private readonly runSeeders: boolean;

	constructor(
		private readonly configService: ConfigService,
		private readonly permissionSeed: PermissionSeed,
		private readonly roleSeed: RoleSeed,
		private readonly userSeed: UserSeed,
	) {
		// Determinar si debemos ejecutar los seeders (configurable por variables de entorno)
		this.runSeeders = this.configService.get<boolean>('database.seed.enabled', process.env.NODE_ENV !== 'production');
	}

	/**
	 * Se ejecuta automáticamente cuando la aplicación inicia
	 */
	async onApplicationBootstrap() {
		if (this.runSeeders) {
			console.log('======= INICIANDO SEEDER DE BASE DE DATOS =======');
			try {
				// Ejecutar seeders en orden de dependencia
				await this.permissionSeed.seed();
				await this.roleSeed.seed();
				await this.userSeed.seed();

				console.log('======= SEEDER COMPLETADO EXITOSAMENTE =======');
			} catch (error) {
				console.error('Error durante la ejecución de los seeders:', error);
			}
		} else {
			console.log('Seeders desactivados por configuración');
		}
	}

	/**
	 * Método para ejecutar los seeders manualmente (ej. desde un comando CLI)
	 */
	async seed() {
		console.log('======= EJECUTANDO SEEDERS MANUALMENTE =======');

		await this.permissionSeed.seed();
		await this.roleSeed.seed();
		await this.userSeed.seed();

		console.log('======= SEEDER MANUAL COMPLETADO =======');
		return true;
	}
}
