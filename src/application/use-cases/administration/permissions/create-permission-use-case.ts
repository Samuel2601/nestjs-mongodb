import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {CreatePermissionDto} from 'src/application/dtos/administration/permission/create-permission-dto';

@Injectable()
export class CreatePermissionUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para crear un nuevo permiso
	 * @param dto Datos para crear el permiso
	 * @returns Permiso creado
	 */
	async execute(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
		// Verifica si ya existe un permiso con la misma clave
		const keyExists = await this.permissionRepository.keyExists(dto.key);
		if (keyExists) {
			throw new BusinessException(`Ya existe un permiso con la clave: ${dto.key}`);
		}

		// Normaliza la clave (lowercase, sin espacios)
		dto.key = dto.key.toLowerCase().trim().replace(/\s+/g, ':');

		// Crea el permiso dentro de una transacción
		const permission = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad
			const permissionEntity = this.permissionMapper.toEntity(dto);

			// Crea el permiso
			return await this.permissionRepository.create(permissionEntity, session);
		});

		// Convierte la entidad a DTO de respuesta
		return this.permissionMapper.toResponseDto(permission);
	}
}
