import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetPermissionsByRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener todos los permisos asignados a un rol
	 * @param roleId ID del rol
	 * @returns Lista de permisos asignados al rol
	 */
	async execute(roleId: string): Promise<PermissionResponseDto[]> {
		// Verifica si el rol existe
		const role = await this.roleRepository.findById(roleId);
		if (!role) {
			throw new BusinessException(`No se encontró el rol con ID: ${roleId}`);
		}

		// Obtiene los permisos asignados al rol
		const permissions = await this.permissionRepository.findByIds(role.permissionIds);

		// Convierte las entidades a DTOs de respuesta
		return this.permissionMapper.toResponseDtos(permissions);
	}
}
