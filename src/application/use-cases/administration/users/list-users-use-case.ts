import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';

@Injectable()
export class ListUsersUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para listar usuarios paginados
	 * @param filter Filtro opcional
	 * @param page Número de página
	 * @param limit Límite de elementos por página
	 * @returns Respuesta paginada con usuarios
	 */
	async execute(filter: any = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<UserResponseDto>> {
		// Obtiene los usuarios paginados
		const result = await this.userRepository.findPaginated(filter, page, limit);

		// Mapea las entidades a DTOs de respuesta
		const usersDto = this.userMapper.toResponseDtos(result.data);

		// Construye la respuesta paginada
		return {
			data: usersDto,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}

	/**
	 * Ejecuta el caso de uso para listar todos los usuarios
	 * @param filter Filtro opcional
	 * @returns Lista de usuarios
	 */
	async executeAll(filter: any = {}): Promise<UserResponseDto[]> {
		// Obtiene todos los usuarios
		const users = await this.userRepository.find(filter);

		// Mapea las entidades a DTOs de respuesta
		return this.userMapper.toResponseDtos(users);
	}
}