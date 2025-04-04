import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class GetUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para obtener un usuario por ID
	 * @param id ID del usuario
	 * @returns Usuario encontrado
	 */
	async execute(id: string): Promise<UserResponseDto> {
		// Busca el usuario por ID
		const user = await this.userRepository.findById(id);

		// Si no existe, lanza una excepción
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${id}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(user);
	}

	/**
	 * Ejecuta el caso de uso para obtener un usuario por email
	 * @param email Email del usuario
	 * @returns Usuario encontrado
	 */
	async executeByEmail(email: string): Promise<UserResponseDto> {
		// Busca el usuario por email
		const user = await this.userRepository.findByEmail(email);

		// Si no existe, lanza una excepción
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con email: ${email}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(user);
	}

	/**
	 * Ejecuta el caso de uso para obtener un usuario por username
	 * @param username Username del usuario
	 * @returns Usuario encontrado
	 */
	async executeByUsername(username: string): Promise<UserResponseDto> {
		// Busca el usuario por username
		const user = await this.userRepository.findByUsername(username);

		// Si no existe, lanza una excepción
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con username: ${username}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(user);
	}
}
