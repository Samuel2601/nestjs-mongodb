import { IsEmail, IsString, IsOptional, MinLength, IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ExternalAuthDto {
  @ApiPropertyOptional({ description: 'Proveedor de autenticación' })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({ description: 'ID del usuario en el proveedor externo' })
  @IsString()
  @IsOptional()
  providerId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com'
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Nombre de usuario',
    example: 'usuario123'
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ 
    description: 'Contraseña del usuario',
    minLength: 8,
    example: 'NuevaContraseña123!'
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ 
    description: 'ID de la persona asociada'
  })
  @IsString()
  @IsOptional()
  personId?: string;

  @ApiPropertyOptional({ 
    description: 'IDs de los roles asignados al usuario',
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Si el usuario está activo'
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Si el correo está verificado'
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Método de autenticación',
    enum: ['local', 'google', 'facebook', 'apple', 'microsoft']
  })
  @IsEnum(['local', 'google', 'facebook', 'apple', 'microsoft'])
  @IsOptional()
  authMethod?: 'local' | 'google' | 'facebook' | 'apple' | 'microsoft';

  @ApiPropertyOptional({ 
    description: 'Datos de autenticación externa',
    type: ExternalAuthDto
  })
  @ValidateNested()
  @Type(() => ExternalAuthDto)
  @IsOptional()
  externalAuth?: ExternalAuthDto;
}
