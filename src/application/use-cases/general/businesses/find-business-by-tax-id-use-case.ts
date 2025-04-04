import {Injectable} from '@nestjs/common';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class FindBusinessByTaxIdUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar una empresa por su identificador fiscal
	 * @param taxId Identificador fiscal
	 * @returns Empresa encontrada
	 */
	async execute(taxId: string): Promise<BusinessResponseDto> {
		// Buscar la empresa por identificador fiscal
		const business = await this.businessRepository.findByTaxId(taxId);

		// Si no existe, lanzar una excepción
		if (!business) {
			throw new BusinessException(`No se encontró la empresa con identificador fiscal: ${taxId}`);
		}

		// Convertir la entidad a DTO de respuesta
		return this.businessMapper.toResponseDto(business);
	}
}
