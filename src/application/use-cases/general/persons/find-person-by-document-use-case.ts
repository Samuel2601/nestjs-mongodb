import {Injectable} from '@nestjs/common';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class FindPersonByDocumentUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para buscar una persona por su documento de identidad
	 * @param documentNumber Número de documento
	 * @param documentType Tipo de documento (opcional)
	 * @returns Persona encontrada
	 */
	async execute(documentNumber: string, documentType?: string): Promise<PersonResponseDto> {
		// Buscar la persona por documento
		const person = await this.personRepository.findByDocument(documentNumber, documentType);

		// Si no existe, lanzar una excepción
		if (!person) {
			throw new BusinessException(`No se encontró la persona con documento ${documentNumber}` + (documentType ? ` de tipo ${documentType}` : ''));
		}

		// Convertir la entidad a DTO de respuesta
		return this.personMapper.toResponseDto(person);
	}
}
