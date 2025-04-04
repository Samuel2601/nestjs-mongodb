import { SetMetadata } from '@nestjs/common';

/**
 * Decorador que establece los roles requeridos para acceder a un controlador o método
 * @param roles Roles permitidos
 * @returns Decorador SetMetadata
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles.map(role => role.toLowerCase()));
