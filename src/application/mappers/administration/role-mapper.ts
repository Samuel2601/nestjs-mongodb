import {Injectable} from '@nestjs/common';
import {CreateRoleDto} from 'src/application/dtos/administration/role/create-role-dto';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';
import {UpdateRoleDto} from 'src/application/dtos/administration/role/update-role-dto';
import {Role} from 'src/domain/entities/administration/role-entity';

@Injectable()
export class RoleMapper {
	/**
	 * Mapea un DTO de creación a una entidad de dominio
	 * @param dto DTO de creación
	 * @returns Entidad de dominio
	 */
	toEntity(dto: CreateRoleDto): Role {
		const entity: Role = {
			name: dto.name,
			description: dto.description,
			permissionIds: dto.permissionIds || [],
			isSystem: dto.isSystem !== undefined ? dto.isSystem : false,
		};

		return entity;
	}

	/**
	 * Mapea un DTO de actualización a una entidad de dominio parcial
	 * @param dto DTO de actualización
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntity(dto: UpdateRoleDto): Partial<Role> {
		const entity: Partial<Role> = {};

		if (dto.name !== undefined) entity.name = dto.name;
		if (dto.description !== undefined) entity.description = dto.description;
		if (dto.permissionIds !== undefined) entity.permissionIds = dto.permissionIds;
		// No permitimos actualizar isSystem a través de la API

		return entity;
	}

	/**
	 * Mapea una entidad de dominio a un DTO de respuesta
	 * @param entity Entidad de dominio
	 * @returns DTO de respuesta
	 */
	toResponseDto(entity: Role): RoleResponseDto {
		return {
			id: typeof entity.id === 'string' ? entity.id : entity.id.toString(),
			name: entity.name,
			description: entity.description,
			permissionIds: entity.permissionIds.map((id) => id.toString()),
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
	toResponseDtos(entities: Role[]): RoleResponseDto[] {
		return entities.map((entity) => this.toResponseDto(entity));
	}
}
