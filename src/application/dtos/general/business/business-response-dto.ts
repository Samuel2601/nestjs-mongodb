import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

class RepresentativeResponseDto {
	@ApiPropertyOptional({description: 'ID de la persona'})
	personId?: string;

	@ApiPropertyOptional({description: 'Cargo o posición'})
	position?: string;
}

class AddressResponseDto {
	@ApiProperty({description: 'ID de la empresa'})
	id: string;

	@ApiProperty({
		description: 'Nombre comercial de la empresa',
		example: 'Acme Inc.',
	})
	name: string;

	@ApiPropertyOptional({
		description: 'Razón social',
		example: 'Acme Incorporated S.L.',
	})
	legalName?: string;

	@ApiPropertyOptional({
		description: 'Número de identificación fiscal',
		example: 'B12345678',
	})
	taxId?: string;

	@ApiPropertyOptional({
		description: 'Tipo de empresa',
		example: 'SL',
	})
	type?: string;

	@ApiPropertyOptional({
		description: 'Industria o sector',
		example: 'Tecnología',
	})
	industry?: string;

	@ApiPropertyOptional({
		description: 'Número de empleados',
		example: 100,
	})
	employeeCount?: number;

	@ApiPropertyOptional({
		description: 'Sitio web',
		example: 'https://www.acme.com',
	})
	website?: string;

	@ApiPropertyOptional({
		description: 'Correo electrónico principal',
		example: 'info@acme.com',
	})
	email?: string;

	@ApiPropertyOptional({
		description: 'Teléfono principal',
		example: '+34 91 123 4567',
	})
	phone?: string;

	@ApiPropertyOptional({
		description: 'Teléfono secundario',
		example: '+34 91 765 4321',
	})
	secondaryPhone?: string;

	@ApiPropertyOptional({
		description: 'Dirección',
		type: AddressResponseDto,
	})
	address?: AddressResponseDto;

	@ApiPropertyOptional({
		description: 'Dirección de facturación',
		type: AddressResponseDto,
	})
	billingAddress?: AddressResponseDto;

	@ApiPropertyOptional({
		description: 'Representante legal',
		type: RepresentativeResponseDto,
	})
	legalRepresentative?: RepresentativeResponseDto;

	@ApiPropertyOptional({
		description: 'Contacto principal',
		type: RepresentativeResponseDto,
	})
	primaryContact?: RepresentativeResponseDto;

	@ApiPropertyOptional({
		description: 'Si la empresa está activa',
		default: true,
	})
	isActive?: boolean;

	@ApiPropertyOptional({
		description: 'Fecha de creación',
	})
	createdAt?: Date;

	@ApiPropertyOptional({
		description: 'Fecha de última actualización',
	})
	updatedAt?: Date;
	@ApiPropertyOptional({description: 'Calle'})
	street?: string;

	@ApiPropertyOptional({description: 'Número'})
	number?: string;

	@ApiPropertyOptional({description: 'Ciudad'})
	city?: string;

	@ApiPropertyOptional({description: 'Estado/Provincia'})
	state?: string;

	@ApiPropertyOptional({description: 'País'})
	country?: string;

	@ApiPropertyOptional({description: 'Código postal'})
	postalCode?: string;
}

export class BusinessResponseDto {
	@ApiProperty({description: 'ID de la empresa'})
	id: string;

	@ApiProperty({
		description: 'Nombre comercial de la empresa',
		example: 'Acme Inc.',
	})
	name: string;

	@ApiPropertyOptional({
		description: 'Razón social',
		example: 'Acme Incorporated S.L.',
	})
	legalName?: string;

	@ApiPropertyOptional({
		description: 'Número de identificación fiscal',
		example: 'B12345678',
	})
	taxId?: string;

	@ApiPropertyOptional({
		description: 'Tipo de empresa',
		example: 'SL',
	})
	type?: string;

	@ApiPropertyOptional({
		description: 'Industria o sector',
		example: 'Tecnología',
	})
	industry?: string;

	@ApiPropertyOptional({
		description: 'Número de empleados',
		example: 100,
	})
	employeeCount?: number;

	@ApiPropertyOptional({
		description: 'Sitio web',
		example: 'https://www.acme.com',
	})
	website?: string;

	@ApiPropertyOptional({
		description: 'Correo electrónico principal',
		example: 'info@acme.com',
	})
	email?: string;

	@ApiPropertyOptional({
		description: 'Teléfono principal',
		example: '+34 91 123 4567',
	})
	phone?: string;

	@ApiPropertyOptional({
		description: 'Teléfono secundario',
		example: '+34 91 765 4321',
	})
	secondaryPhone?: string;

	@ApiPropertyOptional({
		description: 'Dirección',
		type: AddressResponseDto,
	})
	address?: AddressResponseDto;

	@ApiPropertyOptional({
		description: 'Dirección de facturación',
		type: AddressResponseDto,
	})
	billingAddress?: AddressResponseDto;

	@ApiPropertyOptional({
		description: 'Representante legal',
		type: RepresentativeResponseDto,
	})
	legalRepresentative?: RepresentativeResponseDto;

	@ApiPropertyOptional({
		description: 'Contacto principal',
		type: RepresentativeResponseDto,
	})
	primaryContact?: RepresentativeResponseDto;

	@ApiPropertyOptional({
		description: 'Si la empresa está activa',
		default: true,
	})
	isActive?: boolean;

	@ApiPropertyOptional({
		description: 'Fecha de creación',
	})
	createdAt?: Date;

	@ApiPropertyOptional({
		description: 'Fecha de última actualización',
	})
	updatedAt?: Date;
}
