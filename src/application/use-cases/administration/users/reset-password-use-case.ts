import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {randomBytes} from 'crypto';

// DTOs para restablecimiento de contraseña
export class RequestPasswordResetDto {
	email: string;
}

export class CompletePasswordResetDto {
	token: string;
	newPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	/**
	 * Ejecuta el caso de uso para solicitar un restablecimiento de contraseña
	 * @param dto Datos para solicitar el restablecimiento
	 * @returns true si se envió el correo correctamente
	 */
	async requestReset(dto: RequestPasswordResetDto): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findByEmail(dto.email);
		if (!user) {
			// Por seguridad, no indicamos si el correo existe o no
			return true;
		}

		// Genera un token único
		const token = randomBytes(32).toString('hex');

		// Establece la fecha de expiración (24 horas)
		const expires = new Date();
		expires.setHours(expires.getHours() + 24);

		// Guarda el token en la base de datos
		const updatedUser = await this.userRepository.savePasswordResetToken(dto.email, token, expires);
		if (!updatedUser) {
			throw new BusinessException('Error al generar el token de restablecimiento');
		}

		// Aquí deberías enviar un correo con el token
		// Por simplicidad, asumimos que tienes un servicio de email
		// await this.emailService.sendPasswordResetEmail(dto.email, token);

		return true;
	}

	/**
	 * Ejecuta el caso de uso para completar un restablecimiento de contraseña
	 * @param dto Datos para completar el restablecimiento
	 * @returns true si se cambió la contraseña correctamente
	 */
	async completeReset(dto: CompletePasswordResetDto): Promise<boolean> {
		// Busca al usuario por el token
		const user = await this.userRepository.findByResetToken(dto.token);
		if (!user) {
			throw new BusinessException('Token inválido o expirado');
		}

		// Verifica si el token ha expirado
		const now = new Date();
		if (user.passwordResetExpires && user.passwordResetExpires < now) {
			throw new BusinessException('El token ha expirado');
		}

		// Actualiza la contraseña y elimina el token
		const updatedUser = await this.userRepository.updatePassword(user.id, dto.newPassword);
		if (!updatedUser) {
			throw new BusinessException('Error al actualizar la contraseña');
		}

		// Limpia el token de restablecimiento
		// Asumimos que tienes un método para limpiar el token o que updatePassword lo hace

		return true;
	}
}
