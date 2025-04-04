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

import { CreateBusinessDto } from '../../../application/dtos/general/business/create-business.dto';
import { UpdateBusinessDto } from '../../../application/dtos/general/business/update-business.dto';
import { BusinessResponseDto } from '../../../application/dtos/general/business/business-response.dto';
import { PaginatedResponseDto } from '../../../application/dtos/paginated-response.dto';

import { CreateBusinessUseCase } from '../../../application/use-cases/general/businesses/create-business.use-case';
import { GetBusinessUseCase } from '../../../application/use-cases/general/businesses/get-business.use-case';
import { GetBusinessesUseCase } from '../../../application/use-cases/general/businesses/get-businesses.use-case';
import { UpdateBusinessUseCase } from '../../../application/use-cases/general/businesses/update-business.use-case';
import { DeleteBusinessUseCase } from '../../../application/use-cases/general/businesses/delete-business.use-case';
import { FindBusinessByTaxIdUseCase } from '../../../application/use-cases/general/businesses/find-business-by-tax-id.use-case';
import { FindBusinessesByIndustryUseCase } from '../../../application/use-cases/general/businesses/find-businesses-by-industry.use-case';
import { FindBusinessesByContactPersonUseCase } from '../../../application/use-cases/general/businesses/find-businesses-by-contact-person.use-case';

@ApiTags('Businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly getBusinessUseCase: GetBusinessUseCase,
    private readonly getBusinessesUseCase: GetBusinessesUseCase,
    private readonly updateBusinessUseCase: UpdateBusinessUseCase,
    private readonly deleteBusinessUseCase: DeleteBusinessUseCase,
    private readonly findBusinessByTaxIdUseCase: FindBusinessByTaxIdUseCase,
    private readonly findBusinessesByIndustryUseCase: FindBusinessesByIndustryUseCase,
    private readonly findBusinessesByContactPersonUseCase: FindBusinessesByContactPersonUseCase,
  ) {}

  @Post()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Empresa creada exitosamente',
    type: BusinessResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El nombre o identificador fiscal ya existe' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async create(@Body() createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    return await this.createBusinessUseCase.execute(createBusinessDto);
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener empresas paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por nombre' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de empresas obtenida exitosamente',
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
  ): Promise<PaginatedResponseDto<BusinessResponseDto>> {
    return await this.getBusinessesUseCase.execute(page, limit, search);
  }

  @Get('tax-id/:taxId')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar empresa por identificador fiscal' })
  @ApiParam({ name: 'taxId', description: 'Identificador fiscal' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Empresa encontrada',
    type: BusinessResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findByTaxId(@Param('taxId') taxId: string): Promise<BusinessResponseDto> {
    return await this.findBusinessByTaxIdUseCase.execute(taxId);
  }

  @Get('industry/:industry')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar empresas por industria' })
  @ApiParam({ name: 'industry', description: 'Industria o sector' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de empresas obtenida exitosamente',
    type: [BusinessResponseDto]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findByIndustry(@Param('industry') industry: string): Promise<BusinessResponseDto[]> {
    return await this.findBusinessesByIndustryUseCase.execute(industry);
  }

  @Get('contact-person/:personId')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar empresas por persona de contacto' })
  @ApiParam({ name: 'personId', description: 'ID de la persona' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de empresas obtenida exitosamente',
    type: [BusinessResponseDto]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findByContactPerson(@Param('personId') personId: string): Promise<BusinessResponseDto[]> {
    return await this.findBusinessesByContactPersonUseCase.execute(personId);
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Empresa obtenida exitosamente',
    type: BusinessResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findOne(@Param('id') id: string): Promise<BusinessResponseDto> {
    return await this.getBusinessUseCase.execute(id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una empresa' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Empresa actualizada exitosamente',
    type: BusinessResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El nombre o identificador fiscal ya existe' 
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
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return await this.updateBusinessUseCase.execute(id, updateBusinessDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Empresa eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa no encontrada' 
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
    await this.deleteBusinessUseCase.execute(id);
  }
}
