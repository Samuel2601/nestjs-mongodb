import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetRolesByPermissionUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly roleMapper: RoleMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener todos los roles que tienen un permiso específico
	 * @param permissionId ID del permiso
	 * @returns Lista de roles con ese permiso
	 */
	async execute(permissionId: string): Promise<RoleResponseDto[]> {
		// Verifica si el permiso existe
		const permission = await this.permissionRepository.findById(permissionId);
		if (!permission) {
			throw new BusinessException(`No se encontró el permiso con ID: ${permissionId}`);
		}

		// Obtiene los roles que tienen este permiso
		const roles = await this.roleRepository.findByPermission(permissionId);

		// Convierte las entidades a DTOs de respuesta
		return this.roleMapper.toResponseDtos(roles);
	}

	/**
	 * Ejecuta el caso de uso para obtener todos los roles que tienen un permiso específico por clave
	 * @param permissionKey Clave del permiso
	 * @returns Lista de roles con ese permiso
	 */
	async executeByKey(permissionKey: string): Promise<RoleResponseDto[]> {
		// Busca el permiso por su clave
		const permission = await this.permissionRepository.findByKey(permissionKey);
		if (!permission) {
			throw new BusinessException(`No se encontró el permiso con clave: ${permissionKey}`);
		}

		// Obtiene los roles que tienen este permiso
		const roles = await this.roleRepository.findByPermission(permission.id);

		// Convierte las entidades a DTOs de respuesta
		return this.roleMapper.toResponseDtos(roles);
	}
}