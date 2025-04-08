import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class UpdateUserRolesUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar los roles de un usuario
	 * @param userId ID del usuario
	 * @param roleIds IDs de los roles
	 * @returns Usuario actualizado
	 */
	async execute(userId: string, roleIds: string[]): Promise<UserResponseDto> {
		// Verifica si el usuario existe
		const existingUser = await this.userRepository.findById(userId);
		if (!existingUser) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Actualiza los roles del usuario
		const updatedUser = await this.userRepository.updateRoles(userId, roleIds);
		if (!updatedUser) {
			throw new BusinessException(`Error al actualizar los roles del usuario con ID: ${userId}`);
		}

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(updatedUser);
	}
}