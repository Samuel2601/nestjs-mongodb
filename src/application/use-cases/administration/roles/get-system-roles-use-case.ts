import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';

@Injectable()
export class GetSystemRolesUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly roleMapper: RoleMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener todos los roles de sistema
	 * @returns Lista de roles de sistema
	 */
	async execute(): Promise<RoleResponseDto[]> {
		// Obtiene todos los roles de sistema
		const roles = await this.roleRepository.findSystemRoles();

		// Convierte las entidades a DTOs de respuesta
		return this.roleMapper.toResponseDtos(roles);
	}
}