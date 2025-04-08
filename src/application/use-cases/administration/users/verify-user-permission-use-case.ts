import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class VerifyUserPermissionUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
	) {}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene un permiso específico
	 * @param userId ID del usuario
	 * @param permissionCode Código del permiso
	 * @returns true si el usuario tiene el permiso, false en caso contrario
	 */
	async execute(userId: string, permissionCode: string): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no está activo, no tiene permisos
		if (!user.isActive) {
			return false;
		}

		// Si el usuario no tiene roles asignados, no tiene permisos
		if (!user.roleIds || user.roleIds.length === 0) {
			return false;
		}

		// Busca el permiso por su clave (key)
		const permission = await this.permissionRepository.findByKey(permissionCode);
		if (!permission) {
			throw new BusinessException(`No se encontró el permiso con clave: ${permissionCode}`);
		}

		// Verifica si alguno de los roles del usuario tiene el permiso
		for (const roleId of user.roleIds) {
			const role = await this.roleRepository.findById(roleId);
			if (role) {
				// Verifica si el rol tiene el permiso
				const hasPermission = role.permissionIds.some(
					permId => permId.toString() === permission.id.toString()
				);
				if (hasPermission) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene múltiples permisos
	 * @param userId ID del usuario
	 * @param permissionCodes Códigos de los permisos
	 * @returns true si el usuario tiene todos los permisos, false en caso contrario
	 */
	async executeAll(userId: string, permissionCodes: string[]): Promise<boolean> {
		for (const code of permissionCodes) {
			const hasPermission = await this.execute(userId, code);
			if (!hasPermission) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene al menos uno de los permisos
	 * @param userId ID del usuario
	 * @param permissionCodes Códigos de los permisos
	 * @returns true si el usuario tiene al menos uno de los permisos, false en caso contrario
	 */
	async executeAny(userId: string, permissionCodes: string[]): Promise<boolean> {
		for (const code of permissionCodes) {
			const hasPermission = await this.execute(userId, code);
			if (hasPermission) {
				return true;
			}
		}
		return false;
	}
}