import { IsString, IsArray, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'Nombre del rol',
    example: 'Editor'
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del rol',
    example: 'Puede editar contenido pero no eliminarlo'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'IDs de los permisos asignados al rol',
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Si el rol es un rol de sistema',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}
