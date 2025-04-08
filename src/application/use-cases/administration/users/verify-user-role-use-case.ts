import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {BusinessException} from 'src/common/exceptions/business-exception';

@Injectable()
export class VerifyUserRoleUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
	) {}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene un rol específico
	 * @param userId ID del usuario
	 * @param roleId ID del rol
	 * @returns true si el usuario tiene el rol, false en caso contrario
	 */
	async execute(userId: string, roleId: string): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no está activo, no tiene roles
		if (!user.isActive) {
			return false;
		}

		// Verifica si el rol existe
		const role = await this.roleRepository.findById(roleId);
		if (!role) {
			throw new BusinessException(`No se encontró el rol con ID: ${roleId}`);
		}

		// Verifica si el usuario tiene el rol
		return user.roleIds.some(id => id.toString() === roleId);
	}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene un rol específico por nombre
	 * @param userId ID del usuario
	 * @param roleName Nombre del rol
	 * @returns true si el usuario tiene el rol, false en caso contrario
	 */
	async executeByName(userId: string, roleName: string): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no está activo, no tiene roles
		if (!user.isActive) {
			return false;
		}

		// Busca el rol por su nombre
		const role = await this.roleRepository.findByName(roleName);
		if (!role) {
			throw new BusinessException(`No se encontró el rol con nombre: ${roleName}`);
		}

		// Verifica si el usuario tiene el rol
		return user.roleIds.some(id => id.toString() === role.id.toString());
	}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene al menos uno de los roles especificados
	 * @param userId ID del usuario
	 * @param roleIds IDs de los roles
	 * @returns true si el usuario tiene al menos uno de los roles, false en caso contrario
	 */
	async executeAny(userId: string, roleIds: string[]): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no está activo, no tiene roles
		if (!user.isActive) {
			return false;
		}

		// Verifica si el usuario tiene al menos uno de los roles
		return user.roleIds.some(id => roleIds.includes(id.toString()));
	}

	/**
	 * Ejecuta el caso de uso para verificar si un usuario tiene todos los roles especificados
	 * @param userId ID del usuario
	 * @param roleIds IDs de los roles
	 * @returns true si el usuario tiene todos los roles, false en caso contrario
	 */
	async executeAll(userId: string, roleIds: string[]): Promise<boolean> {
		// Verifica si el usuario existe
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new BusinessException(`No se encontró el usuario con ID: ${userId}`);
		}

		// Si el usuario no está activo, no tiene roles
		if (!user.isActive) {
			return false;
		}

		// Verifica si el usuario tiene todos los roles
		return roleIds.every(roleId => user.roleIds.some(id => id.toString() === roleId));
	}
}