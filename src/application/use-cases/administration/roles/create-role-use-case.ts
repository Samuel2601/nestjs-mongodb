import {Injectable} from '@nestjs/common';
import {UnitOfWork} from '../../../../infrastructure/database/unit-of-work';
import {BusinessException} from '../../../../common/exceptions/business-exception';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {CreateRoleDto} from 'src/application/dtos/administration/role/create-role-dto';
import {RoleResponseDto} from 'src/application/dtos/administration/role/role-response-dto';

@Injectable()
export class CreateRoleUseCase {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly roleMapper: RoleMapper,
		private readonly unitOfWork: UnitOfWork,
	) {}

	/**
	 * Ejecuta el caso de uso para crear un nuevo rol
	 * @param dto Datos para crear el rol
	 * @returns Rol creado
	 */
	async execute(dto: CreateRoleDto): Promise<RoleResponseDto> {
		// Verifica si ya existe un rol con el mismo nombre
		const nameExists = await this.roleRepository.nameExists(dto.name);
		if (nameExists) {
			throw new BusinessException(`Ya existe un rol con el nombre: ${dto.name}`);
		}

		// Si hay permissionIds, verifica que todos los permisos existan
		if (dto.permissionIds && dto.permissionIds.length > 0) {
			const permissions = await this.permissionRepository.findByIds(dto.permissionIds);

			if (permissions.length !== dto.permissionIds.length) {
				throw new BusinessException('Algunos de los permisos especificados no existen');
			}
		}

		// Crea el rol dentro de una transacción
		const role = await this.unitOfWork.withTransaction(async (session) => {
			// Convierte el DTO a entidad
			const roleEntity = this.roleMapper.toEntity(dto);

			// Crea el rol
			return await this.roleRepository.create(roleEntity, session);
		});

		// Convierte la entidad a DTO de respuesta
		return this.roleMapper.toResponseDto(role);
	}
}
