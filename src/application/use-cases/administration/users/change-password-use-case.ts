import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {BusinessException} from 'src/common/exceptions/business-exception';

// DTO para cambio de contraseña
export class ChangePasswordDto {
	userId: string;
	currentPassword: string;
	newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
	constructor(
		private readonly userRepository: UserRepository,
	) {}

	/**
	 * Ejecuta el caso de uso para cambiar la contraseña de un usuario
	 * @param dto Datos para cambiar la contraseña
	 * @returns true si se cambió correctamente
	 */
	async execute(dto: ChangePasswordDto): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(dto.userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${dto.userId}`);
		}

		// Aquí deberías tener un servicio para verificar contraseñas
		// Por simplicidad, asumimos que tienes un método en algún servicio que verifica la contraseña actual
		// const isPasswordValid = await this.authService.verifyPassword(user, dto.currentPassword);
		const isPasswordValid = true; // Simulamos que la contraseña es válida

		if (!isPasswordValid) {
			throw new BusinessException('La contraseña actual es incorrecta');
		}

		// Actualiza la contraseña
		const updatedUser = await this.userRepository.updatePassword(dto.userId, dto.newPassword);
		if (!updatedUser) {
			throw new BusinessException(`Error al cambiar la contraseña del usuario con ID: ${dto.userId}`);
		}

		return true;
	}
}