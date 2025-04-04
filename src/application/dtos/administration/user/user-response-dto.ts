import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

class ExternalAuthResponseDto {
	@ApiProperty({description: 'Proveedor de autenticación'})
	provider: string;

	@ApiProperty({description: 'ID del usuario en el proveedor externo'})
	providerId: string;
}

export class UserResponseDto {
	@ApiProperty({description: 'ID del usuario'})
	id: string;

	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@ejemplo.com',
	})
	email: string;

	@ApiProperty({
		description: 'Nombre de usuario',
		example: 'usuario123',
	})
	username: string;

	@ApiPropertyOptional({
		description: 'ID de la persona asociada',
	})
	personId?: string;

	@ApiProperty({
		description: 'IDs de los roles asignados al usuario',
		type: [String],
	})
	roleIds: string[];

	@ApiProperty({
		description: 'Si el usuario está activo',
		default: true,
	})
	isActive: boolean;

	@ApiProperty({
		description: 'Si el correo está verificado',
		default: false,
	})
	isEmailVerified: boolean;

	@ApiPropertyOptional({
		description: 'Fecha del último inicio de sesión',
	})
	lastLogin?: Date;

	@ApiPropertyOptional({
		description: 'Método de autenticación',
		enum: ['local', 'google', 'facebook', 'apple', 'microsoft'],
		default: 'local',
	})
	authMethod?: 'local' | 'google' | 'facebook' | 'apple' | 'microsoft';

	@ApiPropertyOptional({
		description: 'Datos de autenticación externa',
		type: ExternalAuthResponseDto,
	})
	externalAuth?: ExternalAuthResponseDto;

	@ApiPropertyOptional({
		description: 'Fecha de creación',
	})
	createdAt?: Date;

	@ApiPropertyOptional({
		description: 'Fecha de última actualización',
	})
	updatedAt?: Date;
}
