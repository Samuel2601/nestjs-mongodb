import {Injectable} from '@nestjs/common';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';

@Injectable()
export class ListPermissionsUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para listar permisos paginados
	 * @param filter Filtro opcional
	 * @param page Número de página
	 * @param limit Límite de elementos por página
	 * @returns Respuesta paginada con permisos
	 */
	async execute(filter: any = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<PermissionResponseDto>> {
		// Obtiene los permisos paginados
		const result = await this.permissionRepository.findPaginated(filter, page, limit);

		// Mapea las entidades a DTOs de respuesta
		const permissionsDto = this.permissionMapper.toResponseDtos(result.data);

		// Construye la respuesta paginada
		return {
			data: permissionsDto,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}

	/**
	 * Ejecuta el caso de uso para listar todos los permisos
	 * @param filter Filtro opcional
	 * @returns Lista de permisos
	 */
	async executeAll(filter: any = {}): Promise<PermissionResponseDto[]> {
		// Obtiene todos los permisos
		const permissions = await this.permissionRepository.find(filter);

		// Mapea las entidades a DTOs de respuesta
		return this.permissionMapper.toResponseDtos(permissions);
	}

	/**
	 * Ejecuta el caso de uso para listar permisos por grupo
	 * @param group Nombre del grupo
	 * @returns Lista de permisos del grupo
	 */
	async executeByGroup(group: string): Promise<PermissionResponseDto[]> {
		// Obtiene los permisos por grupo
		const permissions = await this.permissionRepository.findByGroup(group);

		// Mapea las entidades a DTOs de respuesta
		return this.permissionMapper.toResponseDtos(permissions);
	}

	/**
	 * Ejecuta el caso de uso para listar todos los grupos de permisos
	 * @returns Lista de nombres de grupos
	 */
	async executeGetAllGroups(): Promise<string[]> {
		// Obtiene todos los grupos de permisos
		return await this.permissionRepository.getAllGroups();
	}
}