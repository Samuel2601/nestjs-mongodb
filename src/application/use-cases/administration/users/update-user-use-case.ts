import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {UpdateUserDto} from '../../../dtos/administration/user/update-user-dto';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class UpdateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar un usuario existente
	 * @param id ID del usuario a actualizar
	 * @param dto Datos para actualizar el usuario
	 * @returns Usuario actualizado
	 */
	async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
		// Verifica si el usuario existe
		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new BusinessException(`No se encontró el usuario con ID: ${id}`);
		}

		// Verifica si se está actualizando el email y si ya existe
		if (dto.email && dto.email !== existingUser.email) {
			const emailExists = await this.userRepository.emailExists(dto.email);
			if (emailExists) {
				throw new BusinessException('El correo electrónico ya está en uso');
			}
		}

		// Verifica si se está actualizando el username y si ya existe
		if (dto.username && dto.username !== existingUser.username) {
			const usernameExists = await this.userRepository.usernameExists(dto.username);
			if (usernameExists) {
				throw new BusinessException('El nombre de usuario ya está en uso');
			}
		}

		// Actualiza el usuario dentro de una transacción
		const updatedUser = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad parcial
			const userPartialEntity = this.userMapper.toPartialEntity(dto);

			// Actualiza el usuario
			const updated = await this.userRepository.update(id, userPartialEntity, session);
			if (!updated) {
				throw new BusinessException(`Error al actualizar el usuario con ID: ${id}`);
			}

			return updated;
		});

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(updatedUser);
	}
}