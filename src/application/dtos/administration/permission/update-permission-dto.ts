import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiPropertyOptional({ 
    description: 'Nombre del permiso',
    example: 'Crear usuarios avanzados'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del permiso',
    example: 'Permite crear usuarios con privilegios avanzados'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Grupo al que pertenece el permiso',
    example: 'Usuarios Avanzados'
  })
  @IsString()
  @IsOptional()
  group?: string;
}
