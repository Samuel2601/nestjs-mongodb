import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({ description: 'ID del permiso' })
  id: string;

  @ApiProperty({ 
    description: 'Clave única del permiso',
    example: 'users:create'
  })
  key: string;

  @ApiProperty({ 
    description: 'Nombre del permiso',
    example: 'Crear usuarios'
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del permiso',
    example: 'Permite crear nuevos usuarios en el sistema'
  })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Grupo al que pertenece el permiso',
    example: 'Usuarios'
  })
  group?: string;

  @ApiProperty({ 
    description: 'Si el permiso es un permiso de sistema',
    default: false
  })
  isSystem: boolean;

  @ApiPropertyOptional({ 
    description: 'Fecha de creación'
  })
  createdAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Fecha de última actualización'
  })
  updatedAt?: Date;
}
