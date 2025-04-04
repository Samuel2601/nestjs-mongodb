import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {CreateUserDto} from '../../../dtos/administration/user/create-user.dto';
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para crear un nuevo usuario
	 * @param dto Datos para crear el usuario
	 * @returns Usuario creado
	 */
	async execute(dto: CreateUserDto): Promise<UserResponseDto> {
		// Verifica si ya existe un usuario con el mismo email
		const emailExists = await this.userRepository.emailExists(dto.email);
		if (emailExists) {
			throw new BusinessException('El correo electrónico ya está en uso');
		}

		// Verifica si ya existe un usuario con el mismo username
		const usernameExists = await this.userRepository.usernameExists(dto.username);
		if (usernameExists) {
			throw new BusinessException('El nombre de usuario ya está en uso');
		}

		// Si es autenticación local, verifica que se haya proporcionado una contraseña
		if ((dto.authMethod === 'local' || !dto.authMethod) && !dto.password) {
			throw new BusinessException('La contraseña es requerida para autenticación local');
		}

		// Crea el usuario dentro de una transacción
		const user = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad
			const userEntity = this.userMapper.toEntity(dto);

			// Crea el usuario
			return await this.userRepository.create(userEntity, session);
		});

		// Convierte la entidad a DTO de respuesta
		return this.userMapper.toResponseDto(user);
	}
}
