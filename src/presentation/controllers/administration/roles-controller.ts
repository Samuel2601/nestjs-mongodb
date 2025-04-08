// Importaciones de NestJS Core
import {Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Patch, HttpCode} from '@nestjs/common';

// Importaciones de Swagger
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

// Guards
import {JwtAuthGuard} from 'src/presentation/guards/auth/jwt-auth.guard';
import {RolesGuard} from 'src/presentation/guards/roles.guard';
import {PermissionsGuard} from 'src/presentation/guards/permissions.guard';

// Decoradores
import {Roles} from 'src/presentation/decorators/roles-decorator';
import {Permissions} from 'src/presentation/decorators/permissions-decorator';
import {Public} from 'src/presentation/decorators/public.decorator';

// DTOs
import {CreateRoleDto} from 'src/application/dtos/administration/role/create-role-dto';
import {UpdateRoleDto} from 'src/application/dtos/administration/role/update-role-dto';

// Use Cases de Roles
import {CreateRoleUseCase} from 'src/application/use-cases/administration/roles/create-role-use-case';
import {GetRoleUseCase} from 'src/application/use-cases/administration/roles/get-role-use-case';
import {UpdateRoleUseCase} from 'src/application/use-cases/administration/roles/update-role-use-case';
import {DeleteRoleUseCase} from 'src/application/use-cases/administration/roles/delete-role-use-case';
import {ListRolesUseCase} from 'src/application/use-cases/administration/roles/list-roles-use-case';
import {GetSystemRolesUseCase} from 'src/application/use-cases/administration/roles/get-system-roles-use-case';
import {AssignPermissionsToRoleUseCase} from 'src/application/use-cases/administration/roles/assign-permissions-to-role-use-case';
import {GetPermissionsByRoleUseCase} from 'src/application/use-cases/administration/roles/get-permissions-by-role-use-case';
import {GetRolesByPermissionUseCase} from 'src/application/use-cases/administration/roles/get-roles-by-permission-use-case';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class RolesController {
	constructor(
		private readonly createRoleUseCase: CreateRoleUseCase,
		private readonly getRoleUseCase: GetRoleUseCase,
		private readonly updateRoleUseCase: UpdateRoleUseCase,
		private readonly deleteRoleUseCase: DeleteRoleUseCase,
		private readonly listRolesUseCase: ListRolesUseCase,
		private readonly getSystemRolesUseCase: GetSystemRolesUseCase,
		private readonly assignPermissionsToRoleUseCase: AssignPermissionsToRoleUseCase,
		private readonly getPermissionsByRoleUseCase: GetPermissionsByRoleUseCase,
		private readonly getRolesByPermissionUseCase: GetRolesByPermissionUseCase,
	) {}

	@Get()
	@ApiOperation({summary: 'Listar roles paginados'})
	@ApiResponse({status: 200, description: 'Lista de roles obtenida con éxito'})
	@ApiQuery({name: 'page', required: false, type: Number, description: 'Número de página'})
	@ApiQuery({name: 'limit', required: false, type: Number, description: 'Elementos por página'})
	@Roles('admin')
	@Permissions('roles:read')
	async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query() filter?: Record<string, any>) {
		// Extraemos page y limit para no enviarlos como parte del filtro
		const {page: _, limit: __, ...filterParams} = filter || {};
		return this.listRolesUseCase.execute(filterParams, page, limit);
	}

	@Get('all')
	@ApiOperation({summary: 'Obtener todos los roles sin paginación'})
	@ApiResponse({status: 200, description: 'Lista completa de roles obtenida con éxito'})
	@Roles('admin')
	@Permissions('roles:read')
	async findAllRoles(@Query() filter?: Record<string, any>) {
		return this.listRolesUseCase.executeAll(filter);
	}

	@Get('system')
	@ApiOperation({summary: 'Obtener todos los roles de sistema'})
	@ApiResponse({status: 200, description: 'Lista de roles de sistema obtenida con éxito'})
	@Roles('admin')
	@Permissions('roles:read')
	async getSystemRoles() {
		return this.getSystemRolesUseCase.execute();
	}

	@Get('by-name/:name')
	@ApiOperation({summary: 'Obtener rol por nombre'})
	@ApiResponse({status: 200, description: 'Rol obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Rol no encontrado'})
	@Roles('admin')
	@Permissions('roles:read')
	async findByName(@Param('name') name: string) {
		return this.getRoleUseCase.executeByName(name);
	}

	@Get(':id')
	@ApiOperation({summary: 'Obtener un rol por ID'})
	@ApiResponse({status: 200, description: 'Rol obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Rol no encontrado'})
	@Roles('admin')
	@Permissions('roles:read')
	async findOne(@Param('id') id: string) {
		return this.getRoleUseCase.execute(id);
	}

	@Get(':id/permissions')
	@ApiOperation({summary: 'Obtener los permisos asignados a un rol'})
	@ApiResponse({status: 200, description: 'Permisos obtenidos con éxito'})
	@ApiResponse({status: 404, description: 'Rol no encontrado'})
	@Roles('admin')
	@Permissions('roles:read')
	async getRolePermissions(@Param('id') id: string) {
		return this.getPermissionsByRoleUseCase.execute(id);
	}

	@Get('by-permission/:permissionId')
	@ApiOperation({summary: 'Obtener roles que tienen un permiso específico'})
	@ApiResponse({status: 200, description: 'Roles obtenidos con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@Roles('admin')
	@Permissions('roles:read')
	async getRolesByPermission(@Param('permissionId') permissionId: string) {
		return this.getRolesByPermissionUseCase.execute(permissionId);
	}

	@Get('by-permission-key/:key')
	@ApiOperation({summary: 'Obtener roles que tienen un permiso específico por clave'})
	@ApiResponse({status: 200, description: 'Roles obtenidos con éxito'})
	@ApiResponse({status: 404, description: 'Permiso no encontrado'})
	@Roles('admin')
	@Permissions('roles:read')
	async getRolesByPermissionKey(@Param('key') key: string) {
		return this.getRolesByPermissionUseCase.executeByKey(key);
	}

	@Post()
	@ApiOperation({summary: 'Crear un nuevo rol'})
	@ApiResponse({status: 201, description: 'Rol creado con éxito'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@Roles('admin')
	@Permissions('roles:create')
	async create(@Body() createRoleDto: CreateRoleDto) {
		return this.createRoleUseCase.execute(createRoleDto);
	}

	@Put(':id')
	@ApiOperation({summary: 'Actualizar un rol'})
	@ApiResponse({status: 200, description: 'Rol actualizado con éxito'})
	@ApiResponse({status: 404, description: 'Rol no encontrado'})
	@ApiResponse({status: 400, description: 'No se puede modificar un rol de sistema'})
	@Roles('admin')
	@Permissions('roles:update')
	async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.updateRoleUseCase.execute(id, updateRoleDto);
	}

	@Patch(':id/permissions')
	@ApiOperation({summary: 'Asignar permisos a un rol'})
	@ApiResponse({status: 200, description: 'Permisos asignados con éxito'})
	@ApiResponse({status: 404, description: 'Rol o permiso no encontrado'})
	@ApiResponse({status: 400, description: 'No se puede modificar un rol de sistema'})
	@Roles('admin')
	@Permissions('roles:update')
	async assignPermissions(@Param('id') id: string, @Body() permissionIds: string[]) {
		return this.assignPermissionsToRoleUseCase.execute(id, permissionIds);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Eliminar un rol'})
	@ApiResponse({status: 200, description: 'Rol eliminado con éxito'})
	@ApiResponse({status: 404, description: 'Rol no encontrado'})
	@ApiResponse({status: 400, description: 'No se puede eliminar un rol de sistema o que está asignado a usuarios'})
	@Roles('admin')
	@Permissions('roles:delete')
	async remove(@Param('id') id: string) {
		return this.deleteRoleUseCase.execute(id);
	}
}
