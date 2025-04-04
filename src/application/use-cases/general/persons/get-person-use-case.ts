import {Injectable} from '@nestjs/common';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class GetPersonUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener una persona por ID
	 * @param id ID de la persona
	 * @returns Persona encontrada
	 */
	async execute(id: string): Promise<PersonResponseDto> {
		// Buscar la persona por ID
		const person = await this.personRepository.findById(id);

		// Si no existe, lanzar una excepción
		if (!person) {
			throw new BusinessException(`No se encontró la persona con ID: ${id}`);
		}

		// Convertir la entidad a DTO de respuesta
		return this.personMapper.toResponseDto(person);
	}
}
