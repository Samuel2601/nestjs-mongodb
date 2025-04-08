import {Injectable} from '@nestjs/common';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetPermissionUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener un permiso por ID
	 * @param id ID del permiso
	 * @returns Permiso encontrado
	 */
	async execute(id: string): Promise<PermissionResponseDto> {
		// Busca el permiso por ID
		const permission = await this.permissionRepository.findById(id);

		// Si no existe, lanza una excepción
		if (!permission) {
			throw new BusinessException(`No se encontró el permiso con ID: ${id}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.permissionMapper.toResponseDto(permission);
	}

	/**
	 * Ejecuta el caso de uso para obtener un permiso por clave
	 * @param key Clave del permiso
	 * @returns Permiso encontrado
	 */
	async executeByKey(key: string): Promise<PermissionResponseDto> {
		// Busca el permiso por clave
		const permission = await this.permissionRepository.findByKey(key);

		// Si no existe, lanza una excepción
		if (!permission) {
			throw new BusinessException(`No se encontró el permiso con clave: ${key}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.permissionMapper.toResponseDto(permission);
	}
}