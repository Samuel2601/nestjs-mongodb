import { IsString, IsOptional, IsEmail, IsDate, IsEnum, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiPropertyOptional({ description: 'Calle' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ description: 'Número' })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ description: 'Ciudad' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado/Provincia' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'País' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Código postal' })
  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class UpdatePersonDto {
  @ApiPropertyOptional({ 
    description: 'Nombres de la persona',
    example: 'Juan Carlos'
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ 
    description: 'Apellidos de la persona',
    example: 'Pérez González'
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Número de documento de identidad',
    example: '12345678A'
  })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de documento',
    example: 'DNI'
  })
  @IsString()
  @IsOptional()
  documentType?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'juan.perez@ejemplo.com'
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono principal',
    example: '+34 91 123 4567'
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono móvil',
    example: '+34 600 123 456'
  })
  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @ApiPropertyOptional({ 
    description: 'Fecha de nacimiento',
    example: '1990-01-01'
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Género',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    example: 'male'
  })
  @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
  @IsOptional()
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  @ApiPropertyOptional({ 
    description: 'Dirección',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}
