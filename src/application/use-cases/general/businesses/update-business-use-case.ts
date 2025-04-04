import {Injectable} from '@nestjs/common';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {UpdateBusinessDto} from 'src/application/dtos/general/business/update-business-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {UnitOfWork} from 'src/infrastructure/database/unit-of-work';

@Injectable()
export class UpdateBusinessUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly personRepository: PersonRepository,
		private readonly businessMapper: BusinessMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar una empresa
	 * @param id ID de la empresa a actualizar
	 * @param dto Datos para actualizar la empresa
	 * @returns Empresa actualizada
	 */
	async execute(id: string, dto: UpdateBusinessDto): Promise<BusinessResponseDto> {
		// Verificar que la empresa existe
		const existingBusiness = await this.businessRepository.findById(id);
		if (!existingBusiness) {
			throw new BusinessException(`No se encontró la empresa con ID: ${id}`);
		}

		// Validaciones de negocio

		// Si se actualiza el nombre, verificar que no exista otro con el mismo
		if (dto.name && dto.name !== existingBusiness.name) {
			const nameExists = await this.businessRepository.nameExists(dto.name);

			if (nameExists) {
				throw new BusinessException(`Ya existe otra empresa con el nombre ${dto.name}`);
			}
		}

		// Si se actualiza el taxId, verificar que no exista otro con el mismo
		if (dto.taxId && dto.taxId !== existingBusiness.taxId) {
			const taxIdExists = await this.businessRepository.taxIdExists(dto.taxId);

			if (taxIdExists) {
				throw new BusinessException(`Ya existe otra empresa con el identificador fiscal ${dto.taxId}`);
			}
		}

		// Si se actualiza el representante legal, verificar que exista la persona
		if (dto.legalRepresentative?.personId) {
			const personExists = await this.personRepository.findById(dto.legalRepresentative.personId);

			if (!personExists) {
				throw new BusinessException(`No existe la persona para el representante legal`);
			}
		}

		// Si se actualiza el contacto principal, verificar que exista la persona
		if (dto.primaryContact?.personId) {
			const personExists = await this.personRepository.findById(dto.primaryContact.personId);

			if (!personExists) {
				throw new BusinessException(`No existe la persona para el contacto principal`);
			}
		}

		// Actualizar la empresa dentro de una transacción
		const updatedBusiness = await this.unitOfWork.withTransaction(async (session) => {
			// Convertir el DTO a entidad manteniendo el ID
			const businessEntity = this.businessMapper.toPartialEntity(dto);

			// Actualizar la empresa
			return await this.businessRepository.update(id, businessEntity, session);
		});

		// Convertir la entidad a DTO de respuesta
		return this.businessMapper.toResponseDto(updatedBusiness);
	}
}
