import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ 
    description: 'Clave única del permiso',
    example: 'users:create'
  })
  @IsString()
  @IsNotEmpty({ message: 'La clave del permiso es requerida' })
  key: string;

  @ApiProperty({ 
    description: 'Nombre del permiso',
    example: 'Crear usuarios'
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del permiso es requerido' })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del permiso',
    example: 'Permite crear nuevos usuarios en el sistema'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Grupo al que pertenece el permiso',
    example: 'Usuarios'
  })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiPropertyOptional({ 
    description: 'Si el permiso es un permiso de sistema',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}
