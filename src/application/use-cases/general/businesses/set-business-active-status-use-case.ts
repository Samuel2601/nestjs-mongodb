import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {UnitOfWork} from 'src/infrastructure/database/unit-of-work';

@Injectable()
export class SetBusinessActiveStatusUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para activar o desactivar una empresa
	 * @param id ID de la empresa
	 * @param isActive Estado de activación a establecer
	 * @returns Empresa actualizada
	 */
	async execute(id: string, isActive: boolean): Promise<BusinessResponseDto> {
		// Verificar que la empresa existe
		const existingBusiness = await this.businessRepository.findById(id);
		if (!existingBusiness) {
			throw new BusinessException(`No se encontró la empresa con ID: ${id}`);
		}

		// Si el estado es el mismo, no hacemos cambios
		if (existingBusiness.isActive === isActive) {
			return this.businessMapper.toResponseDto(existingBusiness);
		}

		// Actualizar el estado dentro de una transacción
		const updatedBusiness = await this.unitOfWork.withTransaction(async (session) => {
			return await this.businessRepository.setActiveStatus(id, isActive);
		});

		// Verificar que la actualización fue exitosa
		if (!updatedBusiness) {
			throw new BusinessException(`No se pudo actualizar el estado de la empresa con ID: ${id}`);
		}

		// Convertir la entidad a DTO de respuesta
		return this.businessMapper.toResponseDto(updatedBusiness);
	}
}