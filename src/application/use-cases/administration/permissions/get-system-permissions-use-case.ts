import {Injectable} from '@nestjs/common';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';

@Injectable()
export class GetSystemPermissionsUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener todos los permisos de sistema
	 * @returns Lista de permisos de sistema
	 */
	async execute(): Promise<PermissionResponseDto[]> {
		// Obtiene todos los permisos de sistema
		const permissions = await this.permissionRepository.findSystemPermissions();

		// Convierte las entidades a DTOs de respuesta
		return this.permissionMapper.toResponseDtos(permissions);
	}
}