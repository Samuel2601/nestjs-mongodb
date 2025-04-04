import {Injectable} from '@nestjs/common';
import {CreatePermissionDto} from 'src/application/dtos/administration/permission/create-permission-dto';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {UpdatePermissionDto} from 'src/application/dtos/administration/permission/update-permission-dto';
import {Permission} from 'src/domain/entities/administration/permission-entity';

@Injectable()
export class PermissionMapper {
	/**
	 * Mapea un DTO de creación a una entidad de dominio
	 * @param dto DTO de creación
	 * @returns Entidad de dominio
	 */
	toEntity(dto: CreatePermissionDto): Permission {
		const entity: Permission = {
			key: dto.key,
			name: dto.name,
			description: dto.description,
			group: dto.group,
			isSystem: dto.isSystem !== undefined ? dto.isSystem : false,
		};

		return entity;
	}

	/**
	 * Mapea un DTO de actualización a una entidad de dominio parcial
	 * @param dto DTO de actualización
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntity(dto: UpdatePermissionDto): Partial<Permission> {
		const entity: Partial<Permission> = {};

		if (dto.name !== undefined) entity.name = dto.name;
		if (dto.description !== undefined) entity.description = dto.description;
		if (dto.group !== undefined) entity.group = dto.group;
		// No permitimos actualizar key o isSystem a través de la API

		return entity;
	}

	/**
	 * Mapea una entidad de dominio a un DTO de respuesta
	 * @param entity Entidad de dominio
	 * @returns DTO de respuesta
	 */
	toResponseDto(entity: Permission): PermissionResponseDto {
		return {
			id: typeof entity.id === 'string' ? entity.id : entity.id.toString(),
			key: entity.key,
			name: entity.name,
			description: entity.description,
			group: entity.group,
			isSystem: entity.isSystem || false,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	/**
	 * Mapea múltiples entidades de dominio a DTOs de respuesta
	 * @param entities Entidades de dominio
	 * @returns DTOs de respuesta
	 */
	toResponseDtos(entities: Permission[]): PermissionResponseDto[] {
		return entities.map((entity) => this.toResponseDto(entity));
	}
	/**
	 * Mapea un DTO de respuesta a una entidad de dominio
	 * @param dto DTO de respuesta
	 * @returns Entidad de dominio
	 */
	toEntityFromResponseDto(dto: PermissionResponseDto): Permission {
		const entity: Permission = {
			id: dto.id,
			key: dto.key,
			name: dto.name,
			description: dto.description,
			group: dto.group,
			isSystem: dto.isSystem !== undefined ? dto.isSystem : false,
			createdAt: dto.createdAt,
			updatedAt: dto.updatedAt,
		};

		return entity;
	}
	/**
	 * Mapea múltiples DTOs de respuesta a entidades de dominio
	 * @param dtos DTOs de respuesta
	 * @returns Entidades de dominio
	 */
	toEntitiesFromResponseDtos(dtos: PermissionResponseDto[]): Permission[] {
		return dtos.map((dto) => this.toEntityFromResponseDto(dto));
	}
	/**
	 * Mapea un DTO de respuesta a una entidad de dominio parcial
	 * @param dto DTO de respuesta
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntityFromResponseDto(dto: PermissionResponseDto): Partial<Permission> {
		const entity: Partial<Permission> = {};

		if (dto.name !== undefined) entity.name = dto.name;
		if (dto.description !== undefined) entity.description = dto.description;
		if (dto.group !== undefined) entity.group = dto.group;
		// No permitimos actualizar key o isSystem a través de la API

		return entity;
	}
	/**
	 * Mapea múltiples DTOs de respuesta a entidades de dominio parciales
	 * @param dtos DTOs de respuesta
	 * @returns Entidades de dominio parciales
	 */
	toPartialEntitiesFromResponseDtos(dtos: PermissionResponseDto[]): Partial<Permission>[] {
		return dtos.map((dto) => this.toPartialEntityFromResponseDto(dto));
	}
	/**
	 * Mapea un DTO de creación a un DTO de respuesta
	 * @param dto DTO de creación
	 * @returns DTO de respuesta
	 */
	toResponseDtoFromEntity(entity: Permission): PermissionResponseDto {
		return {
			id: typeof entity.id === 'string' ? entity.id : entity.id.toString(),
			key: entity.key,
			name: entity.name,
			description: entity.description,
			group: entity.group,
			isSystem: entity.isSystem || false,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
