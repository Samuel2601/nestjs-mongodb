import {Injectable} from '@nestjs/common';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';

@Injectable()
export class GetPersonsUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener un listado paginado de personas
	 * @param filter Filtro de búsqueda
	 * @param page Número de página
	 * @param limit Límite de elementos por página
	 * @returns Listado paginado de personas
	 */
	async execute(filter: any = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<PersonResponseDto>> {
		// Obtener la lista de personas y el total de registros
		const result = await this.personRepository.findPaginated(filter, page, limit);

		// Convertir las entidades a DTOs de respuesta
		const personsDto = this.personMapper.toResponseDtos(result.data);

		// Construir la respuesta paginada
		return {
			data: personsDto,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
