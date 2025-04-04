import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ description: 'ID del rol' })
  id: string;

  @ApiProperty({ 
    description: 'Nombre del rol',
    example: 'Editor'
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del rol',
    example: 'Puede editar contenido pero no eliminarlo'
  })
  description?: string;

  @ApiProperty({ 
    description: 'IDs de los permisos asignados al rol',
    type: [String]
  })
  permissionIds: string[];

  @ApiProperty({ 
    description: 'Si el rol es un rol de sistema',
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
