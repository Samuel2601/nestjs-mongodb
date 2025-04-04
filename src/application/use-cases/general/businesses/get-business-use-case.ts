import {Injectable} from '@nestjs/common';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class GetBusinessUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener una empresa por ID
	 * @param id ID de la empresa
	 * @returns Empresa encontrada
	 */
	async execute(id: string): Promise<BusinessResponseDto> {
		// Buscar la empresa por ID
		const business = await this.businessRepository.findById(id);

		// Si no existe, lanzar una excepción
		if (!business) {
			throw new BusinessException(`No se encontró la empresa con ID: ${id}`);
		}

		// Convertir la entidad a DTO de respuesta
		return this.businessMapper.toResponseDto(business);
	}
}
