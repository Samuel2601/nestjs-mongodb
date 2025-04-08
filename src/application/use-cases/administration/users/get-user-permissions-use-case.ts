import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetUserPermissionsUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener todos los permisos de un usuario
	 * @param userId ID del usuario
	 * @returns Lista de permisos del usuario
	 */
	async execute(userId: string): Promise<PermissionResponseDto[]> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no tiene roles asignados, devuelve una lista vacía
		if (!user.roleIds || user.roleIds.length === 0) {
			return [];
		}

		// Obtiene todos los permisos de los roles del usuario
		// Iteramos por cada rol y obtenemos sus permisos
		let allPermissions = [];
		for (const roleId of user.roleIds) {
			const permissions = await this.permissionRepository.findByIds(
				(await this.roleRepository.findById(roleId))?.permissionIds || []
			);
			allPermissions = [...allPermissions, ...permissions];
		}

		// Elimina duplicados (un permiso puede estar en varios roles)
		const uniquePermissions = this.removeDuplicatePermissions(allPermissions);

		// Convierte las entidades a DTOs de respuesta
		return this.permissionMapper.toResponseDtos(uniquePermissions);
	}

	/**
	 * Elimina permisos duplicados basados en su ID
	 * @param permissions Lista de permisos
	 * @returns Lista de permisos sin duplicados
	 */
	private removeDuplicatePermissions(permissions: any[]): any[] {
		const uniqueMap = new Map();
		
		permissions.forEach(permission => {
			const id = permission.id.toString();
			if (!uniqueMap.has(id)) {
				uniqueMap.set(id, permission);
			}
		});
		
		return Array.from(uniqueMap.values());
	}
}