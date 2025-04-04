import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class FindBusinessByTypeUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar empresas por tipo
	 * @param type Tipo de empresa
	 * @returns Lista de empresas encontradas
	 */
	async execute(type: string): Promise<BusinessResponseDto[]> {
		// Buscar empresas por tipo
		const businesses = await this.businessRepository.findByType(type);
		
		// Convertir las entidades a DTOs de respuesta
		return this.businessMapper.toResponseDtos(businesses);
	}
}