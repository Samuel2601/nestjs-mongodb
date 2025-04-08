import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly roleMapper: RoleMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener un rol por ID
	 * @param id ID del rol
	 * @returns Rol encontrado
	 */
	async execute(id: string): Promise<RoleResponseDto> {
		// Busca el rol por ID
		const role = await this.roleRepository.findById(id);

		// Si no existe, lanza una excepción
		if (!role) {
			throw new BusinessException(`No se encontró el rol con ID: ${id}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.roleMapper.toResponseDto(role);
	}

	/**
	 * Ejecuta el caso de uso para obtener un rol por nombre
	 * @param name Nombre del rol
	 * @returns Rol encontrado
	 */
	async executeByName(name: string): Promise<RoleResponseDto> {
		// Busca el rol por nombre
		const role = await this.roleRepository.findByName(name);

		// Si no existe, lanza una excepción
		if (!role) {
			throw new BusinessException(`No se encontró el rol con nombre: ${name}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.roleMapper.toResponseDto(role);
	}
}