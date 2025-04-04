import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {UnitOfWork} from 'src/infrastructure/database/unit-of-work';

@Injectable()
export class DeleteBusinessUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para eliminar una empresa
	 * @param id ID de la empresa a eliminar
	 * @returns void
	 */
	async execute(id: string): Promise<void> {
		// Verificar que la empresa existe
		const existingBusiness = await this.businessRepository.findById(id);
		if (!existingBusiness) {
			throw new BusinessException(`No se encontró la empresa con ID: ${id}`);
		}

		// Aquí podrían ir validaciones adicionales antes de eliminar
		// Por ejemplo, verificar si la empresa está siendo utilizada en otros módulos

		// Eliminar la empresa dentro de una transacción
		await this.unitOfWork.withTransaction(async (session) => {
			await this.businessRepository.delete(id, session);
		});
	}
}