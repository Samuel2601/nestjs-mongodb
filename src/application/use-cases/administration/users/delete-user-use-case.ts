import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class DeleteUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para eliminar un usuario
	 * @param id ID del usuario a eliminar
	 * @returns true si se eliminó correctamente
	 */
	async execute(id: string): Promise<boolean> {
		// Verifica si el usuario existe
		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new BusinessException(`No se encontró el usuario con ID: ${id}`);
		}

		// Elimina el usuario dentro de una transacción
		const deletedUser = await this.unitOfWork.withTransaction(async (session) => {
			// Elimina el usuario
			return await this.userRepository.delete(id, session);
		});

		if (!deletedUser) {
			throw new BusinessException(`Error al eliminar el usuario con ID: ${id}`);
		}

		return true;
	}
}