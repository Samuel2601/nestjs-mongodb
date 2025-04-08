import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {UserRepository} from '../../domain/repositories/administration/user.repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {ROLES_KEY} from '../decorators/roles-decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private userRepository: UserRepository,
		private roleRepository: RoleRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Obtener los roles requeridos del decorador 'roles'
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		// Si no hay roles requeridos, permitir acceso
		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		// Obtener el usuario del request
		const {user} = context.switchToHttp().getRequest();

		// Asegurar que hay un usuario autenticado
		if (!user || !user.id) {
			return false;
		}

		// Buscar el usuario completo en la base de datos para obtener sus roles
		const dbUser = await this.userRepository.findById(user.id);
		if (!dbUser) {
			return false;
		}

		// Si el usuario no está activo, no permitir acceso
		if (!dbUser.isActive) {
			return false;
		}

		// Verificar si el usuario tiene alguno de los roles requeridos
		for (const roleId of dbUser.roleIds) {
			const role = await this.roleRepository.findById(roleId);

			if (role && requiredRoles.includes(role.name.toLowerCase())) {
				return true;
			}
		}

		return false;
	}
}
