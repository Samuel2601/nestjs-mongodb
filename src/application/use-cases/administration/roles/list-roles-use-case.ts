import {Injectable} from '@nestjs/common';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';

@Injectable()
export class ListRolesUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly roleMapper: RoleMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para listar roles paginados
	 * @param filter Filtro opcional
	 * @param page Número de página
	 * @param limit Límite de elementos por página
	 * @returns Respuesta paginada con roles
	 */
	async execute(filter: any = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<RoleResponseDto>> {
		// Obtiene los roles paginados
		const result = await this.roleRepository.findPaginated(filter, page, limit);

		// Mapea las entidades a DTOs de respuesta
		const rolesDto = this.roleMapper.toResponseDtos(result.data);

		// Construye la respuesta paginada
		return {
			data: rolesDto,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}

	/**
	 * Ejecuta el caso de uso para listar todos los roles
	 * @param filter Filtro opcional
	 * @returns Lista de roles
	 */
	async executeAll(filter: any = {}): Promise<RoleResponseDto[]> {
		// Obtiene todos los roles
		const roles = await this.roleRepository.find(filter);

		// Mapea las entidades a DTOs de respuesta
		return this.roleMapper.toResponseDtos(roles);
	}
}