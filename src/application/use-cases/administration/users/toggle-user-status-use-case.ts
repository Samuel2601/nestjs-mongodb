import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

//DTO para el estado de activación
export class ToggleUserStatusDto {
	userId: string;
	isActive: boolean;
}

@Injectable()
export class ToggleUserStatusUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para activar o desactivar un usuario
	 * @param userId ID del usuario
	 * @param isActive Estado de activación
	 * @returns Usuario actualizado
	 */
	async execute(dto: ToggleUserStatusDto): Promise<UserResponseDto> {
		// Verifica si el usuario existe
		const existingUser = await this.userRepository.findById(dto.userId);
		if (!existingUser) {
			throw new BusinessException(`No se encontró el usuario con ID: ${dto.userId}`);
		}

		// Actualiza el estado del usuario
		const updatedUser = await this.userRepository.setActiveStatus(dto.userId, dto.isActive);
		if (!updatedUser) {
			throw new BusinessException(`Error al cambiar el estado del usuario con ID: ${dto.userId}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(updatedUser);
	}
}
