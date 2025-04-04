import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class FindBusinessByIndustryUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar empresas por industria
	 * @param industry Industria o sector
	 * @returns Lista de empresas encontradas
	 */
	async execute(industry: string): Promise<BusinessResponseDto[]> {
		// Buscar empresas por industria
		const businesses = await this.businessRepository.findByIndustry(industry);
		
		// Convertir las entidades a DTOs de respuesta
		return this.businessMapper.toResponseDtos(businesses);
	}
}