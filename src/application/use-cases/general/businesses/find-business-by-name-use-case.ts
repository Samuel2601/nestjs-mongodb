import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class FindBusinessByNameUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar empresas por nombre
	 * @param name Nombre (parcial) para buscar
	 * @returns Lista de empresas encontradas
	 */
	async execute(name: string): Promise<BusinessResponseDto[]> {
		// Buscar empresas por nombre
		const businesses = await this.businessRepository.findByName(name);
		
		// Convertir las entidades a DTOs de respuesta
		return this.businessMapper.toResponseDtos(businesses);
	}
}