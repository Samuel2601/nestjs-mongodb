import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/domain/repositories/administration/user.repository';

/**
 * Payload del token JWT
 */
export interface JwtPayload {
  sub: string;  // ID del usuario
  email: string;
  username: string;
  roles?: string[];
  iat?: number;  // Issued at
  exp?: number;  // Expires at
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      audience: configService.get<string>('jwt.audience'),
      issuer: configService.get<string>('jwt.issuer'),
    });
  }

  /**
   * Método que se ejecuta cuando se valida el token JWT
   * @param payload Payload del token
   * @returns Usuario autenticado
   */
  async validate(payload: JwtPayload) {
    // Busca el usuario en la base de datos
    const user = await this.userRepository.findById(payload.sub);

    // Verifica si el usuario existe y está activo
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    // Retorna el usuario (se adjuntará a request.user)
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roleIds,
      // No incluyas información sensible como la contraseña
    };
  }
}
