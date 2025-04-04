import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';

@Injectable()
export class GetBusinessesUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly businessMapper: BusinessMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener un listado paginado de empresas
	 * @param pagination Parámetros de paginación y filtrado
	 * @returns Listado paginado de empresas
	 */
	async execute(pagination: PaginatedResponseDto<BusinessResponseDto>): Promise<PaginatedResponseDto<BusinessResponseDto>> {
		// Obtener la lista de empresas y el total de registros
		const result = await this.businessRepository.findPaginated(pagination.data, pagination.page, pagination.limit);

		// Convertir la entidad a DTO de respuesta
		return {
			...result,
			data: this.businessMapper.toResponseDtos(result.data),
		};
	}
}