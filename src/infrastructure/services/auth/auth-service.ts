import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/domain/entities/administration/user.entity';
import { UserRepository } from 'src/domain/repositories/administration/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategies/jwt-strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  /**
   * Valida las credenciales de un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Usuario si las credenciales son válidas, null en caso contrario
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    // Busca el usuario por email
    const user = await this.userRepository.findByEmail(email);

    // Si no existe o no está activo, retorna null
    if (!user || !user.isActive) {
      return null;
    }

    // Verifica si la autenticación es local
    if (user.authMethod !== 'local') {
      return null;
    }

    // Verifica la contraseña (usando bcrypt compare)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Actualiza la fecha de último inicio de sesión
    await this.userRepository.updateLastLogin(user.id, new Date());

    // Retorna el usuario sin la contraseña
    const { password: _, ...result } = user;
    return result as User;
  }

  /**
   * Genera un token JWT para un usuario
   * @param user Usuario para el que se generará el token
   * @returns Token JWT
   */
  async generateToken(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    // Crea el payload del token
    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      username: user.username,
    };

    // Obtiene la configuración del JWT
    const accessTokenExpiration = this.configService.get<string>('jwt.expiresIn');
    const refreshTokenExpiration = this.configService.get<string>('jwt.refreshExpiresIn');
    const refreshTokenSecret = this.configService.get<string>('jwt.refreshSecret');

    // Genera el token de acceso
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiration,
    });

    // Genera el token de refresco
    const refreshToken = this.jwtService.sign(
      { ...payload, tokenType: 'refresh' },
      {
        expiresIn: refreshTokenExpiration,
        secret: refreshTokenSecret,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresca un token JWT
   * @param refreshToken Token de refresco
   * @returns Nuevo token JWT
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verifica el token de refresco usando la configuración
      const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
      
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      // Verifica que sea un token de refresco
      if (payload.tokenType !== 'refresh') {
        throw new Error('Token inválido');
      }

      // Busca el usuario
      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new Error('Usuario no válido o inactivo');
      }

      // Genera un nuevo token
      return this.generateToken(user);
    } catch (error) {
      throw new Error('Token de refresco inválido');
    }
  }
}