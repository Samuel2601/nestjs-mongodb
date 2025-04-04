import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressResponseDto {
  @ApiPropertyOptional({ description: 'Calle' })
  street?: string;

  @ApiPropertyOptional({ description: 'Número' })
  number?: string;

  @ApiPropertyOptional({ description: 'Ciudad' })
  city?: string;

  @ApiPropertyOptional({ description: 'Estado/Provincia' })
  state?: string;

  @ApiPropertyOptional({ description: 'País' })
  country?: string;

  @ApiPropertyOptional({ description: 'Código postal' })
  postalCode?: string;
}

export class PersonResponseDto {
  @ApiProperty({ description: 'ID de la persona' })
  id: string;

  @ApiProperty({ 
    description: 'Nombres de la persona',
    example: 'Juan Carlos'
  })
  firstName: string;

  @ApiProperty({ 
    description: 'Apellidos de la persona',
    example: 'Pérez González'
  })
  lastName: string;

  @ApiPropertyOptional({ 
    description: 'Número de documento de identidad',
    example: '12345678A'
  })
  documentNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de documento',
    example: 'DNI'
  })
  documentType?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'juan.perez@ejemplo.com'
  })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono principal',
    example: '+34 91 123 4567'
  })
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono móvil',
    example: '+34 600 123 456'
  })
  mobilePhone?: string;

  @ApiPropertyOptional({ 
    description: 'Fecha de nacimiento'
  })
  birthDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Género',
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  })
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  @ApiPropertyOptional({ 
    description: 'Dirección',
    type: AddressResponseDto
  })
  address?: AddressResponseDto;

  @ApiPropertyOptional({ 
    description: 'Fecha de creación'
  })
  createdAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Fecha de última actualización'
  })
  updatedAt?: Date;
}
