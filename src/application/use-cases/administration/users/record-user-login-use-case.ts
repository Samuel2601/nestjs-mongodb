import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class RecordUserLoginUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para registrar el último inicio de sesión de un usuario
	 * @param userId ID del usuario
	 * @returns Usuario actualizado
	 */
	async execute(userId: string): Promise<UserResponseDto> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Actualiza la fecha de último inicio de sesión
		const loginDate = new Date();
		const updatedUser = await this.userRepository.updateLastLogin(userId, loginDate);
		
		if (!updatedUser) {
			throw new BusinessException(`Error al actualizar la fecha de último inicio de sesión del usuario con ID: ${userId}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(updatedUser);
	}
}