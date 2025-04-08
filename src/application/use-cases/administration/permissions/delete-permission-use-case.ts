import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';

@Injectable()
export class DeletePermissionUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly roleRepository: RoleRepository,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para eliminar un permiso
	 * @param id ID del permiso a eliminar
	 * @returns true si se eliminó correctamente
	 */
	async execute(id: string): Promise<boolean> {
		// Verifica si el permiso existe
		const existingPermission = await this.permissionRepository.findById(id);
		if (!existingPermission) {
			throw new BusinessException(`No se encontró el permiso con ID: ${id}`);
		}

		// Verifica si el permiso es de sistema y no puede ser eliminado
		const canBeModified = await this.permissionRepository.canBeModified(id);
		if (!canBeModified) {
			throw new BusinessException(`El permiso es de sistema y no puede ser eliminado`);
		}

		// Verifica si hay roles que tienen este permiso asignado
		const rolesWithPermission = await this.roleRepository.findByPermission(id);
		if (rolesWithPermission.length > 0) {
			throw new BusinessException(`No se puede eliminar el permiso porque está asignado a ${rolesWithPermission.length} rol(es). Desasocie el permiso de los roles antes de eliminarlo.`);
		}

		// Elimina el permiso dentro de una transacción
		const deletedPermission = await this.unitOfWork.withTransaction(async (session) => {
			// Elimina el permiso
			return await this.permissionRepository.delete(id, session);
		});

		if (!deletedPermission) {
			throw new BusinessException(`Error al eliminar el permiso con ID: ${id}`);
		}

		return true;
	}
}