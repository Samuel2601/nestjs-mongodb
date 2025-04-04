import {Injectable} from '@nestjs/common';
import {User} from '../../../domain/entities/administration/user.entity';
import {CreateUserDto} from '../../dtos/administration/user/create-user.dto';
import {UpdateUserDto} from 'src/application/dtos/administration/user/update-user-dto';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';

@Injectable()
export class UserMapper {
	/**
	 * Mapea un DTO de creación a una entidad de dominio
	 * @param dto DTO de creación
	 * @returns Entidad de dominio
	 */
	toEntity(dto: CreateUserDto): User {
		const entity: User = {
			email: dto.email,
			username: dto.username,
			password: dto.password,
			personId: dto.personId,
			roleIds: dto.roleIds || [],
			isActive: dto.isActive !== undefined ? dto.isActive : true,
			isEmailVerified: dto.isEmailVerified !== undefined ? dto.isEmailVerified : false,
			authMethod: dto.authMethod || 'local',
			externalAuth: dto.externalAuth,
		};

		return entity;
	}

	/**
	 * Mapea un DTO de actualización a una entidad de dominio parcial
	 * @param dto DTO de actualización
	 * @returns Entidad de dominio parcial
	 */
	toPartialEntity(dto: UpdateUserDto): Partial<User> {
		const entity: Partial<User> = {};

		if (dto.email !== undefined) entity.email = dto.email;
		if (dto.username !== undefined) entity.username = dto.username;
		if (dto.password !== undefined) entity.password = dto.password;
		if (dto.personId !== undefined) entity.personId = dto.personId;
		if (dto.roleIds !== undefined) entity.roleIds = dto.roleIds;
		if (dto.isActive !== undefined) entity.isActive = dto.isActive;
		if (dto.isEmailVerified !== undefined) entity.isEmailVerified = dto.isEmailVerified;
		if (dto.authMethod !== undefined) entity.authMethod = dto.authMethod;
		if (dto.externalAuth !== undefined && dto.externalAuth.provider && dto.externalAuth.providerId) {
			entity.externalAuth = {
				provider: dto.externalAuth.provider,
				providerId: dto.externalAuth.providerId,
			};
		}

		return entity;
	}

	/**
	 * Mapea una entidad de dominio a un DTO de respuesta
	 * @param entity Entidad de dominio
	 * @returns DTO de respuesta
	 */
	toResponseDto(entity: User): UserResponseDto {
		return {
			id: typeof entity.id === 'string' ? entity.id : entity.id.toString(),
			email: entity.email,
			username: entity.username,
			personId: typeof entity.personId === 'string' ? entity.personId : entity.personId.toString(),
			roleIds: entity.roleIds.map((roleId) => (typeof roleId === 'string' ? roleId : roleId.toString())),
			isActive: entity.isActive,
			isEmailVerified: entity.isEmailVerified,
			lastLogin: entity.lastLogin,
			authMethod: entity.authMethod,
			externalAuth: entity.externalAuth
				? {
						provider: entity.externalAuth.provider,
						providerId: entity.externalAuth.providerId,
					}
				: undefined,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	/**
	 * Mapea múltiples entidades de dominio a DTOs de respuesta
	 * @param entities Entidades de dominio
	 * @returns DTOs de respuesta
	 */
	toResponseDtos(entities: User[]): UserResponseDto[] {
		return entities.map((entity) => this.toResponseDto(entity));
	}
}
