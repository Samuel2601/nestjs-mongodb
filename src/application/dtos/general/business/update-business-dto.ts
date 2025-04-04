import { IsString, IsOptional, IsEmail, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
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

class RepresentativeDto {
  @ApiPropertyOptional({ description: 'ID de la persona' })
  @IsString()
  @IsOptional()
  personId?: string;

  @ApiPropertyOptional({ description: 'Cargo o posición' })
  @IsString()
  @IsOptional()
  position?: string;
}

export class UpdateBusinessDto {
  @ApiPropertyOptional({ 
    description: 'Nombre comercial de la empresa',
    example: 'Acme Inc.'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Razón social',
    example: 'Acme Incorporated S.L.'
  })
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiPropertyOptional({ 
    description: 'Número de identificación fiscal',
    example: 'B12345678'
  })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de empresa',
    example: 'SL'
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ 
    description: 'Industria o sector',
    example: 'Tecnología'
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ 
    description: 'Número de empleados',
    example: 100
  })
  @IsNumber()
  @IsOptional()
  employeeCount?: number;

  @ApiPropertyOptional({ 
    description: 'Sitio web',
    example: 'https://www.acme.com'
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico principal',
    example: 'info@acme.com'
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
    description: 'Teléfono secundario',
    example: '+34 91 765 4321'
  })
  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Dirección',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional({ 
    description: 'Dirección de facturación',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billingAddress?: AddressDto;

  @ApiPropertyOptional({ 
    description: 'Representante legal',
    type: RepresentativeDto
  })
  @ValidateNested()
  @Type(() => RepresentativeDto)
  @IsOptional()
  legalRepresentative?: RepresentativeDto;

  @ApiPropertyOptional({ 
    description: 'Contacto principal',
    type: RepresentativeDto
  })
  @ValidateNested()
  @Type(() => RepresentativeDto)
  @IsOptional()
  primaryContact?: RepresentativeDto;

  @ApiPropertyOptional({ 
    description: 'Si la empresa está activa',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
