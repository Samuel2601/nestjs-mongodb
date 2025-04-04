import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {CreateBusinessDto} from 'src/application/dtos/general/business/create-business-dto';

@Injectable()
export class CreateBusinessUseCase {
	constructor(
		private readonly businessRepository: BusinessRepository,
		private readonly personRepository: PersonRepository,
		private readonly businessMapper: BusinessMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para crear una nueva empresa
	 * @param dto Datos para crear la empresa
	 * @returns Empresa creada
	 */
	async execute(dto: CreateBusinessDto): Promise<BusinessResponseDto> {
		// Validaciones de negocio

		// Verificar que el nombre no exista
		const nameExists = await this.businessRepository.nameExists(dto.name);
		if (nameExists) {
			throw new BusinessException(`Ya existe una empresa con el nombre ${dto.name}`);
		}

		// Si se proporciona un taxId, verificar que no exista
		if (dto.taxId) {
			const taxIdExists = await this.businessRepository.taxIdExists(dto.taxId);

			if (taxIdExists) {
				throw new BusinessException(`Ya existe una empresa con el identificador fiscal ${dto.taxId}`);
			}
		}

		// Si se proporciona un representante legal, verificar que exista la persona
		if (dto.legalRepresentative?.personId) {
			const personExists = await this.personRepository.findById(dto.legalRepresentative.personId);

			if (!personExists) {
				throw new BusinessException(`No existe la persona para el representante legal`);
			}
		}

		// Si se proporciona un contacto principal, verificar que exista la persona
		if (dto.primaryContact?.personId) {
			const personExists = await this.personRepository.findById(dto.primaryContact.personId);

			if (!personExists) {
				throw new BusinessException(`No existe la persona para el contacto principal`);
			}
		}

		// Crear la empresa dentro de una transacción
		const business = await this.unitOfWork.withTransaction(async (session) => {
			// Convertir el DTO a entidad
			const businessEntity = this.businessMapper.toEntity(dto);

			// Crear la empresa
			return await this.businessRepository.create(businessEntity, session);
		});

		// Convertir la entidad a DTO de respuesta
		return this.businessMapper.toResponseDto(business);
	}
}
