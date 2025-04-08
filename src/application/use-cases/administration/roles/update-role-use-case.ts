import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {UpdateRoleDto} from '../../../dtos/administration/role/update-role-dto';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';
import {BusinessException} from 'src/common/exceptions/business-exception';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';

@Injectable()
export class UpdateRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly roleMapper: RoleMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para actualizar un rol existente
	 * @param id ID del rol a actualizar
	 * @param dto Datos para actualizar el rol
	 * @returns Rol actualizado
	 */
	async execute(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
		// Verifica si el rol existe
		const existingRole = await this.roleRepository.findById(id);
		if (!existingRole) {
			throw new BusinessException(`No se encontró el rol con ID: ${id}`);
		}

		// Verifica si el rol es de sistema y no puede ser modificado
		const canBeModified = await this.roleRepository.canBeModified(id);
		if (!canBeModified) {
			throw new BusinessException(`El rol es de sistema y no puede ser modificado`);
		}

		// Verifica si se está actualizando el nombre y si ya existe
		if (dto.name && dto.name !== existingRole.name) {
			const nameExists = await this.roleRepository.nameExists(dto.name);
			if (nameExists) {
				throw new BusinessException(`Ya existe un rol con el nombre: ${dto.name}`);
			}
		}

		// Si hay permissionIds, verifica que todos los permisos existan
		if (dto.permissionIds && dto.permissionIds.length > 0) {
			const permissions = await this.permissionRepository.findByIds(dto.permissionIds);

			if (permissions.length !== dto.permissionIds.length) {
				throw new BusinessException('Algunos de los permisos especificados no existen');
			}
		}

		// Actualiza el rol dentro de una transacción
		const updatedRole = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad parcial
			const rolePartialEntity = this.roleMapper.toPartialEntity(dto);

			// Actualiza el rol
			const updated = await this.roleRepository.update(id, rolePartialEntity, session);
			if (!updated) {
				throw new BusinessException(`Error al actualizar el rol con ID: ${id}`);
			}

			return updated;
		});

		// Convierte la entidad a DTO de respuesta
		return this.roleMapper.toResponseDto(updatedRole);
	}
}