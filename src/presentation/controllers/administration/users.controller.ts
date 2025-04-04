import {Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpStatus, HttpCode} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

import {JwtAuthGuard} from '../../guards/auth/jwt-auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {Roles} from '../../decorators/roles.decorator';
import {User} from '../../decorators/user.decorator';

import {CreateUserDto} from '../../../application/dtos/administration/user/create-user.dto';
import {UpdateUserDto} from '../../../application/dtos/administration/user/update-user.dto';
import {UserResponseDto} from '../../../application/dtos/administration/user/user-response.dto';
import {PaginatedResponseDto} from '../../../application/dtos/paginated-response.dto';

import {CreateUserUseCase} from '../../../application/use-cases/administration/users/create-user.use-case';
import {GetUserUseCase} from '../../../application/use-cases/administration/users/get-user.use-case';
import {GetUsersUseCase} from '../../../application/use-cases/administration/users/get-users.use-case';
import {UpdateUserUseCase} from '../../../application/use-cases/administration/users/update-user.use-case';
import {DeleteUserUseCase} from '../../../application/use-cases/administration/users/delete-user.use-case';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly getUserUseCase: GetUserUseCase,
		private readonly getUsersUseCase: GetUsersUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
	) {}

	@Post()
	@Roles('admin')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({summary: 'Crear un nuevo usuario'})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Usuario creado exitosamente',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Datos de entrada inválidos',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'El correo o nombre de usuario ya existe',
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Acceso prohibido',
	})
	async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
		return await this.createUserUseCase.execute(createUserDto);
	}

	@Get()
	@Roles('admin')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'Obtener usuarios paginados'})
	@ApiQuery({name: 'page', required: false, type: Number, example: 1})
	@ApiQuery({name: 'limit', required: false, type: Number, example: 10})
	@ApiQuery({name: 'search', required: false, type: String})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Lista de usuarios obtenida exitosamente',
		type: PaginatedResponseDto,
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Acceso prohibido',
	})
	async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string): Promise<PaginatedResponseDto<UserResponseDto>> {
		return await this.getUsersUseCase.execute(page, limit, search);
	}

	@Get(':id')
	@Roles('admin')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'Obtener un usuario por ID'})
	@ApiParam({name: 'id', description: 'ID del usuario'})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Usuario obtenido exitosamente',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado',
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Acceso prohibido',
	})
	async findOne(@Param('id') id: string): Promise<UserResponseDto> {
		return await this.getUserUseCase.execute(id);
	}

	@Get('profile/me')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'Obtener perfil del usuario actual'})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Perfil obtenido exitosamente',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	async getProfile(@User() user: any): Promise<UserResponseDto> {
		return await this.getUserUseCase.execute(user.id);
	}

	@Put(':id')
	@Roles('admin')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'Actualizar un usuario'})
	@ApiParam({name: 'id', description: 'ID del usuario'})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Usuario actualizado exitosamente',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Datos de entrada inválidos',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'El correo o nombre de usuario ya existe',
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Acceso prohibido',
	})
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
		return await this.updateUserUseCase.execute(id, updateUserDto);
	}

	@Delete(':id')
	@Roles('admin')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({summary: 'Eliminar un usuario'})
	@ApiParam({name: 'id', description: 'ID del usuario'})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Usuario eliminado exitosamente',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado',
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'No autorizado',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Acceso prohibido',
	})
	async remove(@Param('id') id: string): Promise<void> {
		await this.deleteUserUseCase.execute(id);
	}
}
