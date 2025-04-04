import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {CreatePersonDto} from 'src/application/dtos/general/person/create-person-dto';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class CreatePersonUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para crear una nueva persona
	 * @param dto Datos para crear la persona
	 * @returns Persona creada
	 */
	async execute(dto: CreatePersonDto): Promise<PersonResponseDto> {
		// Validaciones de negocio

		// Si se proporciona un documento, verificar que no exista
		if (dto.documentNumber) {
			const documentExists = await this.personRepository.documentExists(dto.documentNumber, dto.documentType);

			if (documentExists) {
				throw new BusinessException(`Ya existe una persona con el documento ${dto.documentNumber}` + (dto.documentType ? ` de tipo ${dto.documentType}` : ''));
			}
		}

		// Si se proporciona un email, verificar que no exista
		if (dto.email) {
			const emailExists = await this.personRepository.emailExists(dto.email);

			if (emailExists) {
				throw new BusinessException(`Ya existe una persona con el email ${dto.email}`);
			}
		}

		// Crear la persona dentro de una transacción
		const person = await this.unitOfWork.withTransaction(async (session) => {
			// Convertir el DTO a entidad
			const personEntity = this.personMapper.toEntity(dto);

			// Crear la persona
			return await this.personRepository.create(personEntity, session);
		});

		// Convertir la entidad a DTO de respuesta
		return this.personMapper.toResponseDto(person);
	}
}
