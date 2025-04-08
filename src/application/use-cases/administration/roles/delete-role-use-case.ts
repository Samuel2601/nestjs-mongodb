import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {UserRepository} from 'src/domain/repositories/administration/user.repository';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class DeleteRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly userRepository: UserRepository,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para eliminar un rol
	 * @param id ID del rol a eliminar
	 * @returns true si se eliminó correctamente
	 */
	async execute(id: string): Promise<boolean> {
		// Verifica si el rol existe
		const existingRole = await this.roleRepository.findById(id);
		if (!existingRole) {
			throw new BusinessException(`No se encontró el rol con ID: ${id}`);
		}

		// Verifica si el rol es de sistema y no puede ser eliminado
		const canBeModified = await this.roleRepository.canBeModified(id);
		if (!canBeModified) {
			throw new BusinessException(`El rol es de sistema y no puede ser eliminado`);
		}

		// Verifica si hay usuarios que tienen este rol asignado
		const usersWithRole = await this.userRepository.findByRoles([id]);
		if (usersWithRole && usersWithRole.length > 0) {
			throw new BusinessException(`No se puede eliminar el rol porque está asignado a ${usersWithRole.length} usuario(s)`);
		}

		// Elimina el rol dentro de una transacción
		const deletedRole = await this.unitOfWork.withTransaction(async (session) => {
			// Elimina el rol
			return await this.roleRepository.delete(id, session);
		});

		if (!deletedRole) {
			throw new BusinessException(`Error al eliminar el rol con ID: ${id}`);
		}

		return true;
	}
}