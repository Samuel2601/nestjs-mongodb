import {Injectable} from '@nestjs/common';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class FindPersonByEmailUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar una persona por su correo electrónico
	 * @param email Correo electrónico
	 * @returns Persona encontrada
	 */
	async execute(email: string): Promise<PersonResponseDto> {
		// Buscar la persona por email
		const person = await this.personRepository.findByEmail(email);

		// Si no existe, lanzar una excepción
		if (!person) {
			throw new BusinessException(`No se encontró la persona con email ${email}`);
		}

		// Convertir la entidad a DTO de respuesta
		return this.personMapper.toResponseDto(person);
	}
}
