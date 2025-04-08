import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class AssignPermissionsToRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly roleMapper: RoleMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para asignar permisos a un rol
	 * @param roleId ID del rol
	 * @param permissionIds IDs de los permisos
	 * @returns Rol actualizado
	 */
	async execute(roleId: string, permissionIds: string[]): Promise<RoleResponseDto> {
		// Verifica si el rol existe
		const role = await this.roleRepository.findById(roleId);
		if (!role) {
			throw new BusinessException(`No se encontró el rol con ID: ${roleId}`);
		}

		// Verifica que todos los permisos existan
		for (const permissionId of permissionIds) {
			const permission = await this.permissionRepository.findById(permissionId);
			if (!permission) {
				throw new BusinessException(`No se encontró el permiso con ID: ${permissionId}`);
			}
		}

		// Verifica si el rol es de sistema y no puede ser modificado
		const canBeModified = await this.roleRepository.canBeModified(roleId);
		if (!canBeModified) {
			throw new BusinessException(`El rol es de sistema y no puede ser modificado`);
		}

		// Actualiza los permisos del rol dentro de una transacción
		const updatedRole = await this.unitOfWork.withTransaction(async (session) => {
			// Asigna los permisos al rol
			const updated = await this.roleRepository.updatePermissions(roleId, permissionIds, session);
			if (!updated) {
				throw new BusinessException(`Error al asignar permisos al rol con ID: ${roleId}`);
			}

			return updated;
		});

		// Convierte la entidad a DTO de respuesta
		return this.roleMapper.toResponseDto(updatedRole);
	}
}