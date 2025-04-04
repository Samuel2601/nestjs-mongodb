import {Injectable} from '@nestjs/common';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {UnitOfWork} from 'src/infrastructure/database/unit-of-work';

@Injectable()
export class DeletePersonUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para eliminar una persona
	 * @param id ID de la persona a eliminar
	 * @returns void
	 */
	async execute(id: string): Promise<void> {
		// Verificar que la persona existe
		const existingPerson = await this.personRepository.findById(id);
		if (!existingPerson) {
			throw new BusinessException(`No se encontró la persona con ID: ${id}`);
		}

		// Aquí podrían ir validaciones adicionales antes de eliminar
		// Por ejemplo, verificar si la persona está siendo utilizada en otros módulos

		// Eliminar la persona dentro de una transacción
		await this.unitOfWork.withTransaction(async (session) => {
			await this.personRepository.delete(id, session);
		});
	}
}
