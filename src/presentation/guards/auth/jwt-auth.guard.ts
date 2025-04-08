import {Injectable, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
		super();
	}

	canActivate(context: ExecutionContext) {
		// Verifica si la ruta está marcada como pública
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);

		// Si la ruta es pública, permite el acceso sin verificar el token
		if (isPublic) {
			return true;
		}

		// De lo contrario, verifica el token JWT
		return super.canActivate(context);
	}

	handleRequest(err, user, info) {
		// Si hay un error o no hay usuario (token inválido)
		if (err || !user) {
			throw err || new UnauthorizedException('Token de autenticación inválido o expirado');
		}
		return user;
	}
}
