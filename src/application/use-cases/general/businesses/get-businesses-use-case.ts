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
	 * @param filter Filtro de búsqueda
	 * @param page Número de página
	 * @param limit Límite de elementos por página
	 * @returns Listado paginado de empresas
	 */
	async execute(filter: any = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<BusinessResponseDto>> {
		// Obtener la lista de empresas y el total de registros
		const result = await this.businessRepository.findPaginated(filter, page, limit);

		// Convertir las entidades a DTOs de respuesta
		const businessesDto = this.businessMapper.toResponseDtos(result.data);

		// Construir la respuesta paginada
		return {
			data: businessesDto,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
