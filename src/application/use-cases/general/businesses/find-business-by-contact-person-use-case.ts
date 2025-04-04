import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';

@Injectable()
export class FindBusinessByContactPersonUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar empresas por contacto o representante
	 * @param personId ID de la persona que es contacto o representante
	 * @returns Lista de empresas encontradas
	 */
	async execute(personId: string): Promise<BusinessResponseDto[]> {
		// Buscar empresas por persona de contacto
		const businesses = await this.businessRepository.findByContactPerson(personId);
		
		// Convertir las entidades a DTOs de respuesta
		return this.businessMapper.toResponseDtos(businesses);
	}
}