import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {UpdatePermissionDto} from '../../../dtos/administration/permission/update-permission-dto';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';

@Injectable()
export class UpdatePermissionUseCase {
	constructor(
		private readonly permissionRepository: PermissionRepository,
		private readonly permissionMapper: PermissionMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar un permiso existente
	 * @param id ID del permiso a actualizar
	 * @param dto Datos para actualizar el permiso
	 * @returns Permiso actualizado
	 */
	async execute(id: string, dto: UpdatePermissionDto): Promise<PermissionResponseDto> {
		// Verifica si el permiso existe
		const existingPermission = await this.permissionRepository.findById(id);
		if (!existingPermission) {
			throw new BusinessException(`No se encontró el permiso con ID: ${id}`);
		}

		// Verifica si el permiso es de sistema y no puede ser modificado
		const canBeModified = await this.permissionRepository.canBeModified(id);
		if (!canBeModified) {
			throw new BusinessException(`El permiso es de sistema y no puede ser modificado`);
		}

		// Actualiza el permiso dentro de una transacción
		const updatedPermission = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad parcial
			const permissionPartialEntity = this.permissionMapper.toPartialEntity(dto);

			// Actualiza el permiso
			const updated = await this.permissionRepository.update(id, permissionPartialEntity, session);
			if (!updated) {
				throw new BusinessException(`Error al actualizar el permiso con ID: ${id}`);
			}

			return updated;
		});

		// Convierte la entidad a DTO de respuesta
		return this.permissionMapper.toResponseDto(updatedPermission);
	}
}