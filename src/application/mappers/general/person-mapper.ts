import {Injectable} from '@nestjs/common';
import {CreatePersonDto} from '../../dtos/general/person/create-person-dto';
import {Person} from 'src/domain/entities/general/person-entity';
import {UpdatePersonDto} from 'src/application/dtos/general/person/update-person-dto';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class PersonMapper {
	/**
	 * Mapea un DTO de creación a una entidad de dominio
	 * @param dto DTO de creación
	 * @returns Entidad de dominio
	 */
	toEntity(dto: CreatePersonDto): Person {
		const entity: Person = {
			firstName: dto.firstName,
			lastName: dto.lastName,
			documentNumber: dto.documentNumber,
			documentType: dto.documentType,
			email: dto.email,
			phone: dto.phone,
			mobilePhone: dto.mobilePhone,
			birthDate: dto.birthDate,
			gender: dto.gender,
			address: dto.address,
		};

		return entity;
	}

	/**
	 * Mapea un DTO de actualización a una entidad de dominio parcial
	 * @param dto DTO de actualización
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntity(dto: UpdatePersonDto): Partial<Person> {
		const entity: Partial<Person> = {};

		if (dto.firstName !== undefined) entity.firstName = dto.firstName;
		if (dto.lastName !== undefined) entity.lastName = dto.lastName;
		if (dto.documentNumber !== undefined) entity.documentNumber = dto.documentNumber;
		if (dto.documentType !== undefined) entity.documentType = dto.documentType;
		if (dto.email !== undefined) entity.email = dto.email;
		if (dto.phone !== undefined) entity.phone = dto.phone;
		if (dto.mobilePhone !== undefined) entity.mobilePhone = dto.mobilePhone;
		if (dto.birthDate !== undefined) entity.birthDate = dto.birthDate;
		if (dto.gender !== undefined) entity.gender = dto.gender;
		if (dto.address !== undefined) entity.address = dto.address;

		return entity;
	}

	/**
	 * Mapea una entidad de dominio a un DTO de respuesta
	 * @param entity Entidad de dominio
	 * @returns DTO de respuesta
	 */
	toResponseDto(entity: Person): PersonResponseDto {
		return {
			id: entity.id!.toString(),
			firstName: entity.firstName,
			lastName: entity.lastName,
			documentNumber: entity.documentNumber,
			documentType: entity.documentType,
			email: entity.email,
			phone: entity.phone,
			mobilePhone: entity.mobilePhone,
			birthDate: entity.birthDate,
			gender: entity.gender,
			address: entity.address,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	/**
	 * Mapea múltiples entidades de dominio a DTOs de respuesta
	 * @param entities Entidades de dominio
	 * @returns DTOs de respuesta
	 */
	toResponseDtos(entities: Person[]): PersonResponseDto[] {
		return entities.map((entity) => this.toResponseDto(entity));
	}
}
