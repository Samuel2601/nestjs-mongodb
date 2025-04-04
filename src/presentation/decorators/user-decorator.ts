import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para obtener el usuario autenticado en los controladores
 * @param data Propiedad específica del usuario (opcional)
 * @param ctx Contexto de ejecución
 * @returns Usuario completo o propiedad específica del usuario
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
