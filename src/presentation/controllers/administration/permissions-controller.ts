// Importaciones de NestJS Core
import {Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Patch, HttpCode, HttpStatus} from '@nestjs/common';

// Importaciones de Swagger
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam} from '@nestjs/swagger';

// Guards
import {JwtAuthGuard} from 'src/presentation/guards/auth/jwt-auth.guard';
import {RolesGuard} from 'src/presentation/guards/roles.guard';
import {PermissionsGuard} from 'src/presentation/guards/permissions.guard';

// Decoradores
import {Roles} from 'src/presentation/decorators/roles-decorator';
import {Permissions} from 'src/presentation/decorators/permissions-decorator';
import {Public} from 'src/presentation/decorators/public.decorator';

// DTOs
import {CreatePermissionDto} from 'src/application/dtos/administration/permission/create-permission-dto';
import {UpdatePermissionDto} from 'src/application/dtos/administration/permission/update-permission-dto';
import {PermissionResponseDto} from 'src/application/dtos/administration/permission/permission-response-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';

// Use Cases de Permisos
import {CreatePermissionUseCase} from 'src/application/use-cases/administration/permissions/create-permission-use-case';
import {GetPermissionUseCase} from 'src/application/use-cases/administration/permissions/get-permission-use-case';
import {DeletePermissionUseCase} from 'src/application/use-cases/administration/permissions/delete-permission-use-case';
import {UpdatePermissionUseCase} from 'src/application/use-cases/administration/permissions/update-permission-use-case';
import {ListPermissionsUseCase} from 'src/application/use-cases/administration/permissions/list-permissions-use-case';
import {GetSystemPermissionsUseCase} from 'src/application/use-cases/administration/permissions/get-system-permissions-use-case';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PermissionsController {
	constructor(
		private readonly createPermissionUseCase: CreatePermissionUseCase,
		private readonly getPermissionUseCase: GetPermissionUseCase,
		private readonly updatePermissionUseCase: UpdatePermissionUseCase,
		private readonly deletePermissionUseCase: DeletePermissionUseCase,
		private readonly listPermissionsUseCase: ListPermissionsUseCase,
		private readonly getSystemPermissionsUseCase: GetSystemPermissionsUseCase,
	) {}

	@Get()
	@ApiOperation({summary: 'Listar permisos paginados'})
	@ApiResponse({status: 200, description: 'Lista de permisos obtenida con éxito'})
	@ApiQuery({name: 'page', required: false, type: Number, description: 'Número de página'})
	@ApiQuery({name: 'limit', required: false, type: Number, description: 'Elementos por página'})
	@ApiQuery({name: 'group', required: false, type: String, description: 'Filtrar por grupo'})
	@Roles('admin')
	@Permissions('permissions:read')
	async findAll(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
		@Query('group') group?: string,
		@Query() filter?: Record<string, any>,
	): Promise<PaginatedResponseDto<PermissionResponseDto>> {
		// Si se proporciona un grupo, filtramos por ese grupo
		if (group) {
			const permissions = await this.listPermissionsUseCase.executeByGroup(group);
			// Simulamos una respuesta paginada con todos los permisos del grupo
			return {
				data: permissions,
				total: permissions.length,
				page: 1,
				limit: permissions.length,
				totalPages: 1,
			};
		}

		// Extraemos page y limit para no enviarlos como parte del filtro
		const {page: _, limit: __, group: ___, ...filterParams} = filter || {};
		return this.listPermissionsUseCase.execute(filterParams, page, limit);
	}

	@Get('all')
	@ApiOperation({summary: 'Obtener todos los permisos sin paginación'})
	@ApiResponse({status: 200, description: 'Lista completa de permisos obtenida con éxito'})
	@Roles('admin')
	@Permissions('permissions:read')
	async findAllPermissions(@Query() filter?: Record<string, any>): Promise<PermissionResponseDto[]> {
		return this.listPermissionsUseCase.executeAll(filter);
	}

	@Get('system')
	@ApiOperation({summary: 'Obtener todos los permisos de sistema'})
	@ApiResponse({status: 200, description: 'Lista de permisos de sistema obtenida con éxito'})
	@Roles('admin')
	@Permissions('permissions:read')
	async getSystemPermissions(): Promise<PermissionResponseDto[]> {
		return this.getSystemPermissionsUseCase.execute();
	}

	@Get('groups')
	@ApiOperation({summary: 'Obtener todos los grupos de permisos'})
	@ApiResponse({status: 200, description: 'Lista de grupos de permisos obtenida con éxito'})
	@Roles('admin')
	@Permissions('permissions:read')
	async getGroups(): Promise<string[]> {
		return this.listPermissionsUseCase.executeGetAllGroups();
	}

	@Get('by-key/:key')
	@ApiOperation({summary: 'Obtener permiso por clave'})
	@ApiResponse({status: 200, description: 'Permiso obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@ApiParam({name: 'key', description: 'Clave del permiso', example: 'users:create'})
	@Roles('admin')
	@Permissions('permissions:read')
	async findByKey(@Param('key') key: string): Promise<PermissionResponseDto> {
		return this.getPermissionUseCase.executeByKey(key);
	}

	@Get(':id')
	@ApiOperation({summary: 'Obtener un permiso por ID'})
	@ApiResponse({status: 200, description: 'Permiso obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@ApiParam({name: 'id', description: 'ID del permiso'})
	@Roles('admin')
	@Permissions('permissions:read')
	async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
		return this.getPermissionUseCase.execute(id);
	}

	@Post()
	@ApiOperation({summary: 'Crear un nuevo permiso'})
	@ApiResponse({status: 201, description: 'Permiso creado con éxito'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@HttpCode(HttpStatus.CREATED)
	@Roles('admin')
	@Permissions('permissions:create')
	async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
		return this.createPermissionUseCase.execute(createPermissionDto);
	}

	@Put(':id')
	@ApiOperation({summary: 'Actualizar un permiso'})
	@ApiResponse({status: 200, description: 'Permiso actualizado con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@ApiResponse({status: 400, description: 'No se puede modificar un permiso de sistema'})
	@ApiParam({name: 'id', description: 'ID del permiso'})
	@Roles('admin')
	@Permissions('permissions:update')
	async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<PermissionResponseDto> {
		return this.updatePermissionUseCase.execute(id, updatePermissionDto);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Eliminar un permiso'})
	@ApiResponse({status: 200, description: 'Permiso eliminado con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@ApiResponse({status: 400, description: 'No se puede eliminar un permiso de sistema o que está asignado a roles'})
	@ApiParam({name: 'id', description: 'ID del permiso'})
	@Roles('admin')
	@Permissions('permissions:delete')
	async remove(@Param('id') id: string): Promise<boolean> {
		return this.deletePermissionUseCase.execute(id);
	}
}
