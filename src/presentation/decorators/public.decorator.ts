import {SetMetadata} from '@nestjs/common';

/**
 * Decorador que marca una ruta como pública (no requiere autenticación)
 * @returns Decorador SetMetadata
 */
export const PublicKey = 'isPublic';
export const Public = () => SetMetadata('isPublic', true);
