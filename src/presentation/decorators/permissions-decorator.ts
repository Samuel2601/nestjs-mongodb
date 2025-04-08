import {SetMetadata} from '@nestjs/common';

/**
 * Decorador que establece los permisos requeridos para acceder a un controlador o método
 * @param permissions Permisos permitidos
 * @returns Decorador SetMetadata
 */
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
	SetMetadata(
		'permissions',
		permissions.map((permission) => permission.toLowerCase()),
	);
