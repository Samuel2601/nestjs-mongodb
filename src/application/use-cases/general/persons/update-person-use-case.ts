import {Injectable} from '@nestjs/common';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';
import {UpdatePersonDto} from 'src/application/dtos/general/person/update-person-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {UnitOfWork} from 'src/infrastructure/database/unit-of-work';

@Injectable()
export class UpdatePersonUseCase {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly personMapper: PersonMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar una persona
	 * @param id ID de la persona a actualizar
	 * @param dto Datos para actualizar la persona
	 * @returns Persona actualizada
	 */
	async execute(id: string, dto: UpdatePersonDto): Promise<PersonResponseDto> {
		// Verificar que la persona existe
		const existingPerson = await this.personRepository.findById(id);
		if (!existingPerson) {
			throw new BusinessException(`No se encontró la persona con ID: ${id}`);
		}

		// Validaciones de negocio

		// Si se actualiza el documento, verificar que no exista otro con el mismo
		if (dto.documentNumber && (dto.documentNumber !== existingPerson.documentNumber || dto.documentType !== existingPerson.documentType)) {
			const documentExists = await this.personRepository.documentExists(dto.documentNumber, dto.documentType);

			if (documentExists) {
				throw new BusinessException(`Ya existe otra persona con el documento ${dto.documentNumber}` + (dto.documentType ? ` de tipo ${dto.documentType}` : ''));
			}
		}

		// Si se actualiza el email, verificar que no exista otro con el mismo
		if (dto.email && dto.email !== existingPerson.email) {
			const emailExists = await this.personRepository.emailExists(dto.email);

			if (emailExists) {
				throw new BusinessException(`Ya existe otra persona con el email ${dto.email}`);
			}
		}

		// Actualizar la persona dentro de una transacción
		const updatedPerson = await this.unitOfWork.withTransaction(async (session) => {
			// Convertir el DTO a entidad manteniendo el ID
			const personEntity = this.personMapper.toPartialEntity(dto);

			// Actualizar la persona
			return await this.personRepository.update(id, personEntity, session);
		});

		// Convertir la entidad a DTO de respuesta
		return this.personMapper.toResponseDto(updatedPerson);
	}
}
