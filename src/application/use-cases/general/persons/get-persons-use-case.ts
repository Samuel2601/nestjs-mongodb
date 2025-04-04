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
	 * @param pagination Parámetros de paginación y filtrado
	 * @returns Listado paginado de personas
	 */
	async execute(pagination: PaginatedResponseDto<PersonResponseDto>): Promise<PaginatedResponseDto<PersonResponseDto>> {
		// Obtener la lista de personas y el total de registros
		const result = await this.personRepository.findPaginated(pagination.data, pagination.page, pagination.limit);

		// Convertir la entidad a DTO de respuesta
		return {
			...result,
			data: this.personMapper.toResponseDtos(result.data),
		};
	}
}
