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

import { CreatePermissionDto } from '../../../application/dtos/administration/permission/create-permission.dto';
import { UpdatePermissionDto } from '../../../application/dtos/administration/permission/update-permission.dto';
import { PermissionResponseDto } from '../../../application/dtos/administration/permission/permission-response.dto';
import { PaginatedResponseDto } from '../../../application/dtos/paginated-response.dto';

import { CreatePermissionUseCase } from '../../../application/use-cases/administration/permissions/create-permission.use-case';
import { GetPermissionUseCase } from '../../../application/use-cases/administration/permissions/get-permission.use-case';
import { GetPermissionsUseCase } from '../../../application/use-cases/administration/permissions/get-permissions.use-case';
import { UpdatePermissionUseCase } from '../../../application/use-cases/administration/permissions/update-permission.use-case';
import { DeletePermissionUseCase } from '../../../application/use-cases/administration/permissions/delete-permission.use-case';
import { GetPermissionsByGroupUseCase } from '../../../application/use-cases/administration/permissions/get-permissions-by-group.use-case';
import { GetPermissionGroupsUseCase } from '../../../application/use-cases/administration/permissions/get-permission-groups.use-case';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionUseCase: GetPermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
    private readonly getPermissionsByGroupUseCase: GetPermissionsByGroupUseCase,
    private readonly getPermissionGroupsUseCase: GetPermissionGroupsUseCase,
  ) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Permiso creado exitosamente',
    type: PermissionResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'La clave del permiso ya existe' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    return await this.createPermissionUseCase.execute(createPermissionDto);
  }

  @Get()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener permisos paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'group', required: false, type: String })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de permisos obtenida exitosamente',
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
    @Query('group') group?: string,
  ): Promise<PaginatedResponseDto<PermissionResponseDto>> {
    if (group) {
      return await this.getPermissionsByGroupUseCase.execute(group, page, limit);
    }
    return await this.getPermissionsUseCase.execute(page, limit, search);
  }

  @Get('groups')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los grupos de permisos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de grupos obtenida exitosamente',
    type: [String]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findAllGroups(): Promise<string[]> {
    return await this.getPermissionGroupsUseCase.execute();
  }

  @Get(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Permiso obtenido exitosamente',
    type: PermissionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Permiso no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
    return await this.getPermissionUseCase.execute(id);
  }

  @Put(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Permiso actualizado exitosamente',
    type: PermissionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Permiso no encontrado' 
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
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return await this.updatePermissionUseCase.execute(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Permiso eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Permiso no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'No se puede eliminar un permiso de sistema' 
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
    await this.deletePermissionUseCase.execute(id);
  }
}