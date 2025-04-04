import {Injectable} from '@nestjs/common';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {CreateBusinessDto} from 'src/application/dtos/general/business/create-business-dto';
import {UpdateBusinessDto} from 'src/application/dtos/general/business/update-business-dto';
import {Business} from 'src/domain/entities/general/business-entity';

@Injectable()
export class BusinessMapper {
	/**
	 * Mapea un DTO de creación a una entidad de dominio
	 * @param dto DTO de creación
	 * @returns Entidad de dominio
	 */
	toEntity(dto: CreateBusinessDto): Business {
		const entity: Business = {
			name: dto.name,
			legalName: dto.legalName,
			taxId: dto.taxId,
			type: dto.type,
			industry: dto.industry,
			employeeCount: dto.employeeCount,
			website: dto.website,
			email: dto.email,
			phone: dto.phone,
			secondaryPhone: dto.secondaryPhone,
			address: dto.address,
			billingAddress: dto.billingAddress,
			legalRepresentative: dto.legalRepresentative,
			primaryContact: dto.primaryContact,
			isActive: dto.isActive !== undefined ? dto.isActive : true,
		};

		return entity;
	}

	/**
	 * Mapea un DTO de actualización a una entidad de dominio parcial
	 * @param dto DTO de actualización
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntity(dto: UpdateBusinessDto): Partial<Business> {
		const entity: Partial<Business> = {};

		if (dto.name !== undefined) entity.name = dto.name;
		if (dto.legalName !== undefined) entity.legalName = dto.legalName;
		if (dto.taxId !== undefined) entity.taxId = dto.taxId;
		if (dto.type !== undefined) entity.type = dto.type;
		if (dto.industry !== undefined) entity.industry = dto.industry;
		if (dto.employeeCount !== undefined) entity.employeeCount = dto.employeeCount;
		if (dto.website !== undefined) entity.website = dto.website;
		if (dto.email !== undefined) entity.email = dto.email;
		if (dto.phone !== undefined) entity.phone = dto.phone;
		if (dto.secondaryPhone !== undefined) entity.secondaryPhone = dto.secondaryPhone;
		if (dto.address !== undefined) entity.address = dto.address;
		if (dto.billingAddress !== undefined) entity.billingAddress = dto.billingAddress;
		if (dto.legalRepresentative !== undefined) entity.legalRepresentative = dto.legalRepresentative;
		if (dto.primaryContact !== undefined) entity.primaryContact = dto.primaryContact;
		if (dto.isActive !== undefined) entity.isActive = dto.isActive;

		return entity;
	}

	/**
	 * Mapea una entidad de dominio a un DTO de respuesta
	 * @param entity Entidad de dominio
	 * @returns DTO de respuesta
	 */
	toResponseDto(entity: Business): BusinessResponseDto {
		return {
			id: typeof entity.id === 'string' ? entity.id : entity.id?.toString() || '',
			name: entity.name,
			legalName: entity.legalName,
			taxId: entity.taxId,
			type: entity.type,
			industry: entity.industry,
			employeeCount: entity.employeeCount,
			website: entity.website,
			email: entity.email,
			phone: entity.phone,
			secondaryPhone: entity.secondaryPhone,
			address: entity.address
				? {
						id: (entity.address as any)?.id?.toString() || '', // Añadir ID aunque sea vacío
						name: entity.name || '', // Usar el nombre de la empresa
						street: entity.address.street,
						number: entity.address.number,
						city: entity.address.city,
						state: entity.address.state,
						country: entity.address.country,
						postalCode: entity.address.postalCode,
					}
				: undefined,
			billingAddress: entity.billingAddress
				? {
						id: (entity.billingAddress as any)?.id?.toString() || '', // Añadir ID aunque sea vacío
						name: `Facturación: ${entity.name}` || '', // Nombre descriptivo
						street: entity.billingAddress.street,
						number: entity.billingAddress.number,
						city: entity.billingAddress.city,
						state: entity.billingAddress.state,
						country: entity.billingAddress.country,
						postalCode: entity.billingAddress.postalCode,
					}
				: undefined,
			legalRepresentative: entity.legalRepresentative
				? {
						...entity.legalRepresentative,
						personId: typeof entity.legalRepresentative.personId === 'string' ? entity.legalRepresentative.personId : entity.legalRepresentative.personId?.toString(),
					}
				: undefined,
			primaryContact: entity.primaryContact
				? {
						...entity.primaryContact,
						personId: typeof entity.primaryContact.personId === 'string' ? entity.primaryContact.personId : entity.primaryContact.personId?.toString(),
					}
				: undefined,
			isActive: entity.isActive,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	/**
	 * Mapea múltiples entidades de dominio a DTOs de respuesta
	 * @param entities Entidades de dominio
	 * @returns DTOs de respuesta
	 */
	toResponseDtos(entities: Business[]): BusinessResponseDto[] {
		return entities.map((entity) => this.toResponseDto(entity));
	}
}
