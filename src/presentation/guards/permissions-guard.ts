import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '../../domain/repositories/administration/user.repository';
import { RoleRepository } from '../../domain/repositories/administration/role.repository';
import { PermissionRepository } from '../../domain/repositories/administration/permission.repository';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private permissionRepository: PermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los permisos requeridos del decorador
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    
    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Obtener el usuario del request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Si no hay usuario o no tiene id, no permitir acceso
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

    // Obtener todos los roles del usuario
    const userRoles = await Promise.all(
      dbUser.roleIds.map(roleId => this.roleRepository.findById(roleId))
    );

    // Filtrar los roles válidos (no null)
    const validRoles = userRoles.filter(role => role !== null);

    // Obtener todos los permisos de todos los roles
    const permissionIds = validRoles.flatMap(role => role!.permissionIds);
    
    // Si no hay permisos, no permitir acceso
    if (permissionIds.length === 0) {
      return false;
    }

    // Obtener todos los permisos
    const permissions = await this.permissionRepository.findByIds(permissionIds);
    
    // Verificar si el usuario tiene alguno de los permisos requeridos
    for (const permission of permissions) {
      if (requiredPermissions.includes(permission.key)) {
        return true;
      }
    }

    return false;
  }
}
