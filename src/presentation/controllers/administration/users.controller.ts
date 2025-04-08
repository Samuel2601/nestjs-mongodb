// Importaciones de NestJS Core
import {Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Patch, HttpCode} from '@nestjs/common';

// Importaciones de Swagger
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

// DTOs
import {CreateUserDto} from 'src/application/dtos/administration/user/create-user.dto';
import {UpdateUserDto} from 'src/application/dtos/administration/user/update-user-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';
import {UserResponseDto} from 'src/application/dtos/administration/user/user-response-dto';
import {ToggleUserStatusDto} from 'src/application/use-cases/administration/users/toggle-user-status-use-case';
import {ChangePasswordDto} from 'src/application/use-cases/administration/users/change-password-use-case';
import {CompletePasswordResetDto, RequestPasswordResetDto} from 'src/application/use-cases/administration/users/reset-password-use-case';

// Guards
import {JwtAuthGuard} from 'src/presentation/guards/auth/jwt-auth.guard';
import {RolesGuard} from 'src/presentation/guards/roles.guard';
import {PermissionsGuard} from 'src/presentation/guards/permissions.guard';

// Decoradores
import {Roles} from 'src/presentation/decorators/roles-decorator';
import {Permissions} from 'src/presentation/decorators/permissions-decorator';
import {Public} from 'src/presentation/decorators/public.decorator';
import {User} from 'src/presentation/decorators/user-decorator';

// Use Cases
import {CreateUserUseCase} from 'src/application/use-cases/administration/users/create-user.use-case';
import {GetUserUseCase} from 'src/application/use-cases/administration/users/get-user-use-case';
import {UpdateUserUseCase} from 'src/application/use-cases/administration/users/update-user-use-case';
import {DeleteUserUseCase} from 'src/application/use-cases/administration/users/delete-user-use-case';
import {ListUsersUseCase} from 'src/application/use-cases/administration/users/list-users-use-case';
import {ToggleUserStatusUseCase} from 'src/application/use-cases/administration/users/toggle-user-status-use-case';
import {ChangePasswordUseCase} from 'src/application/use-cases/administration/users/change-password-use-case';
import {ResetPasswordUseCase} from 'src/application/use-cases/administration/users/reset-password-use-case';
import {RecordUserLoginUseCase} from 'src/application/use-cases/administration/users/record-user-login-use-case';
import {GetUserPermissionsUseCase} from 'src/application/use-cases/administration/users/get-user-permissions-use-case';
import {VerifyUserPermissionUseCase} from 'src/application/use-cases/administration/users/verify-user-permission-use-case';
import {VerifyUserRoleUseCase} from 'src/application/use-cases/administration/users/verify-user-role-use-case';
import {UpdateUserRolesUseCase} from 'src/application/use-cases/administration/users/update-user-roles-use-case';

// DTOs adicionales necesarios
class VerifyUserPermissionDto {
	permissionCode: string;
}

class VerifyUserRoleDto {
	roleId?: string;
	roleName?: string;
	roleIds?: string[];
	checkAll?: boolean;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly getUserUseCase: GetUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
		private readonly listUsersUseCase: ListUsersUseCase,
		private readonly updateUserRolesUseCase: UpdateUserRolesUseCase,
		private readonly toggleUserStatusUseCase: ToggleUserStatusUseCase,
		private readonly changePasswordUseCase: ChangePasswordUseCase,
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
		private readonly recordUserLoginUseCase: RecordUserLoginUseCase,
		private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
		private readonly verifyUserPermissionUseCase: VerifyUserPermissionUseCase,
		private readonly verifyUserRoleUseCase: VerifyUserRoleUseCase,
	) {}

	@Get()
	@ApiOperation({summary: 'Listar usuarios paginados'})
	@ApiResponse({status: 200, description: 'Lista de usuarios obtenida con éxito'})
	@ApiQuery({name: 'page', required: false, type: Number, description: 'Número de página'})
	@ApiQuery({name: 'limit', required: false, type: Number, description: 'Elementos por página'})
	@ApiQuery({name: 'search', required: false, type: String, description: 'Búsqueda general en campos de texto'})
	@ApiQuery({name: 'filter', required: false, type: String, description: 'Filtro avanzado en formato JSON (compatible con MongoDB)'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async findAll(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
		@Query('search') search?: string,
		@Query('filter') filterStr?: string,
	): Promise<PaginatedResponseDto<UserResponseDto>> {
		// Inicializamos el filtro
		let filter: Record<string, any> = {};

		// Parsear el filtro avanzado si se proporciona
		if (filterStr) {
			try {
				filter = JSON.parse(filterStr);
				// Validación adicional
				if (typeof filter !== 'object' || filter === null) {
					filter = {};
				}
			} catch (error) {
				// Si hay un error al parsear, se usa un filtro vacío
				console.error('Error al parsear el filtro:', error);
			}
		}

		// Si hay un término de búsqueda general, creamos una consulta con $or para buscar en múltiples campos
		if (search && search.trim()) {
			const searchTerm = search.trim();
			const searchRegex = {$regex: searchTerm, $options: 'i'};

			// Lista de campos de texto donde buscar
			const textFields = ['email', 'username', 'externalAuth.provider', 'externalAuth.providerId'];

			// Creamos una condición $or para buscar en todos los campos de texto
			const searchConditions = textFields.map((field) => ({[field]: searchRegex}));

			// Si ya existe un filtro, lo combinamos con la búsqueda usando $and
			if (Object.keys(filter).length > 0) {
				filter = {$and: [filter, {$or: searchConditions}]};
			} else {
				filter = {$or: searchConditions};
			}
		}

		return this.listUsersUseCase.execute(filter, page, limit);
	}

	@Get('all')
	@ApiOperation({summary: 'Obtener todos los usuarios sin paginación'})
	@ApiResponse({status: 200, description: 'Lista completa de usuarios obtenida con éxito'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async findAllUsers(@Query() filter?: Record<string, any>) {
		return this.listUsersUseCase.executeAll(filter);
	}

	@Get('me')
	@ApiOperation({summary: 'Obtener perfil del usuario actual'})
	@ApiResponse({status: 200, description: 'Perfil obtenido con éxito'})
	async getProfile(@User() user) {
		return this.getUserUseCase.execute(user.id);
	}

	@Get('by-email/:email')
	@ApiOperation({summary: 'Obtener usuario por email'})
	@ApiResponse({status: 200, description: 'Usuario obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async findByEmail(@Param('email') email: string) {
		return this.getUserUseCase.executeByEmail(email);
	}

	@Get('by-username/:username')
	@ApiOperation({summary: 'Obtener usuario por nombre de usuario'})
	@ApiResponse({status: 200, description: 'Usuario obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async findByUsername(@Param('username') username: string) {
		return this.getUserUseCase.executeByUsername(username);
	}

	@Public()
	@Get('public-info')
	@ApiOperation({summary: 'Obtener información pública sobre usuarios'})
	@ApiResponse({status: 200, description: 'Información pública obtenida con éxito'})
	async getPublicInfo() {
		return {message: 'Esta es información pública sobre usuarios'};
	}

	@Get(':id')
	@ApiOperation({summary: 'Obtener un usuario por ID'})
	@ApiResponse({status: 200, description: 'Usuario obtenido con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async findOne(@Param('id') id: string) {
		return this.getUserUseCase.execute(id);
	}

	@Get(':id/permissions')
	@ApiOperation({summary: 'Obtener los permisos de un usuario'})
	@ApiResponse({status: 200, description: 'Permisos obtenidos con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async getUserPermissions(@Param('id') id: string) {
		return this.getUserPermissionsUseCase.execute(id);
	}

	@Post()
	@ApiOperation({summary: 'Crear un nuevo usuario'})
	@ApiResponse({status: 201, description: 'Usuario creado con éxito'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@Roles('admin')
	@Permissions('users:create')
	async create(@Body() createUserDto: CreateUserDto) {
		return this.createUserUseCase.execute(createUserDto);
	}

	@Post('password/request-reset')
	@ApiOperation({summary: 'Solicitar restablecimiento de contraseña'})
	@ApiResponse({status: 200, description: 'Solicitud procesada con éxito'})
	@Public()
	async requestPasswordReset(@Body() requestDto: RequestPasswordResetDto) {
		return this.resetPasswordUseCase.requestReset(requestDto);
	}

	@Post('password/complete-reset')
	@ApiOperation({summary: 'Completar restablecimiento de contraseña'})
	@ApiResponse({status: 200, description: 'Contraseña restablecida con éxito'})
	@ApiResponse({status: 400, description: 'Token inválido o expirado'})
	@Public()
	async completePasswordReset(@Body() completeDto: CompletePasswordResetDto) {
		return this.resetPasswordUseCase.completeReset(completeDto);
	}

	@Post(':id/verify-permission')
	@ApiOperation({summary: 'Verificar si un usuario tiene un permiso específico'})
	@ApiResponse({status: 200, description: 'Resultado de la verificación'})
	@ApiResponse({status: 404, description: 'Usuario o permiso no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async verifyUserPermission(@Param('id') id: string, @Body() dto: VerifyUserPermissionDto) {
		return this.verifyUserPermissionUseCase.execute(id, dto.permissionCode);
	}

	@Post(':id/verify-permissions/all')
	@ApiOperation({summary: 'Verificar si un usuario tiene todos los permisos especificados'})
	@ApiResponse({status: 200, description: 'Resultado de la verificación'})
	@ApiResponse({status: 404, description: 'Usuario o permiso no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async verifyUserPermissionsAll(@Param('id') id: string, @Body() permissionCodes: string[]) {
		return this.verifyUserPermissionUseCase.executeAll(id, permissionCodes);
	}

	@Post(':id/verify-permissions/any')
	@ApiOperation({summary: 'Verificar si un usuario tiene al menos uno de los permisos especificados'})
	@ApiResponse({status: 200, description: 'Resultado de la verificación'})
	@ApiResponse({status: 404, description: 'Usuario o permiso no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async verifyUserPermissionsAny(@Param('id') id: string, @Body() permissionCodes: string[]) {
		return this.verifyUserPermissionUseCase.executeAny(id, permissionCodes);
	}

	@Post(':id/verify-role')
	@ApiOperation({summary: 'Verificar si un usuario tiene un rol específico'})
	@ApiResponse({status: 200, description: 'Resultado de la verificación'})
	@ApiResponse({status: 404, description: 'Usuario o rol no encontrado'})
	@Roles('admin', 'user-manager')
	@Permissions('users:read')
	async verifyUserRole(@Param('id') id: string, @Body() dto: VerifyUserRoleDto) {
		if (dto.roleId) {
			return this.verifyUserRoleUseCase.execute(id, dto.roleId);
		} else if (dto.roleName) {
			return this.verifyUserRoleUseCase.executeByName(id, dto.roleName);
		} else if (dto.roleIds && dto.checkAll) {
			return this.verifyUserRoleUseCase.executeAll(id, dto.roleIds);
		} else if (dto.roleIds) {
			return this.verifyUserRoleUseCase.executeAny(id, dto.roleIds);
		}

		throw new Error('Se requiere al menos un parámetro: roleId, roleName o roleIds');
	}

	@Put(':id')
	@ApiOperation({summary: 'Actualizar un usuario'})
	@ApiResponse({status: 200, description: 'Usuario actualizado con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin')
	@Permissions('users:update')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.updateUserUseCase.execute(id, updateUserDto);
	}

	@Patch(':id/roles')
	@ApiOperation({summary: 'Actualizar los roles de un usuario'})
	@ApiResponse({status: 200, description: 'Roles actualizados con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin')
	@Permissions('users:update')
	async updateRoles(@Param('id') id: string, @Body() roleIds: string[]) {
		return this.updateUserRolesUseCase.execute(id, roleIds);
	}

	@Patch(':id/status')
	@ApiOperation({summary: 'Cambiar el estado de un usuario (activo/inactivo)'})
	@ApiResponse({status: 200, description: 'Estado actualizado con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin')
	@Permissions('users:update')
	async toggleUserStatus(@Body() dto: ToggleUserStatusDto) {
		return this.toggleUserStatusUseCase.execute(dto);
	}

	@Patch(':id/password')
	@ApiOperation({summary: 'Cambiar la contraseña de un usuario'})
	@ApiResponse({status: 200, description: 'Contraseña actualizada con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@ApiResponse({status: 400, description: 'Contraseña actual incorrecta'})
	async changePassword(@Body() dto: ChangePasswordDto) {
		return this.changePasswordUseCase.execute(dto);
	}

	@Post(':id/record-login')
	@ApiOperation({summary: 'Registrar un inicio de sesión de un usuario'})
	@ApiResponse({status: 200, description: 'Inicio de sesión registrado con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@HttpCode(200)
	async recordUserLogin(@Param('id') id: string) {
		return this.recordUserLoginUseCase.execute(id);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Eliminar un usuario'})
	@ApiResponse({status: 200, description: 'Usuario eliminado con éxito'})
	@ApiResponse({status: 404, description: 'Usuario no encontrado'})
	@Roles('admin')
	@Permissions('users:delete')
	async remove(@Param('id') id: string) {
		return this.deleteUserUseCase.execute(id);
	}
}
