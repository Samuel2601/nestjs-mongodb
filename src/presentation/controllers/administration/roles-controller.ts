import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { CreateRoleDto } from '../../../application/dtos/administration/role/create-role.dto';
import { UpdateRoleDto } from '../../../application/dtos/administration/role/update-role.dto';
import { RoleResponseDto } from '../../../application/dtos/administration/role/role-response.dto';
import { PaginatedResponseDto } from '../../../application/dtos/paginated-response.dto';

import { CreateRoleUseCase } from '../../../application/use-cases/administration/roles/create-role.use-case';
import { GetRoleUseCase } from '../../../application/use-cases/administration/roles/get-role.use-case';
import { GetRolesUseCase } from '../../../application/use-cases/administration/roles/get-roles.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/administration/roles/update-role.use-case';
import { DeleteRoleUseCase } from '../../../application/use-cases/administration/roles/delete-role.use-case';
import { UpdateRolePermissionsUseCase } from '../../../application/use-cases/administration/roles/update-role-permissions.use-case';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly updateRolePermissionsUseCase: UpdateRolePermissionsUseCase,
  ) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Rol creado exitosamente',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El nombre del rol ya existe' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return await this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener roles paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de roles obtenida exitosamente',
    type: PaginatedResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedResponseDto<RoleResponseDto>> {
    return await this.getRolesUseCase.execute(page, limit, search);
  }

  @Get(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Rol obtenido exitosamente',
    type: RoleResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Rol no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    return await this.getRoleUseCase.execute(id);
  }

  @Put(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Rol actualizado exitosamente',
    type: RoleResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Rol no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El nombre del rol ya existe' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return await this.updateRoleUseCase.execute(id, updateRoleDto);
  }

  @Put(':id/permissions')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar permisos de un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Permisos de rol actualizados exitosamente',
    type: RoleResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Rol no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async updatePermissions(
    @Param('id') id: string,
    @Body() permissionIds: string[],
  ): Promise<RoleResponseDto> {
    return await this.updateRolePermissionsUseCase.execute(id, permissionIds);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Rol eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Rol no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'No se puede eliminar un rol de sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }
}
