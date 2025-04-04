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

import { CreatePersonDto } from '../../../application/dtos/general/person/create-person.dto';
import { UpdatePersonDto } from '../../../application/dtos/general/person/update-person.dto';
import { PersonResponseDto } from '../../../application/dtos/general/person/person-response.dto';
import { PaginatedResponseDto } from '../../../application/dtos/paginated-response.dto';

import { CreatePersonUseCase } from '../../../application/use-cases/general/persons/create-person.use-case';
import { GetPersonUseCase } from '../../../application/use-cases/general/persons/get-person.use-case';
import { GetPersonsUseCase } from '../../../application/use-cases/general/persons/get-persons.use-case';
import { UpdatePersonUseCase } from '../../../application/use-cases/general/persons/update-person.use-case';
import { DeletePersonUseCase } from '../../../application/use-cases/general/persons/delete-person.use-case';
import { FindPersonByDocumentUseCase } from '../../../application/use-cases/general/persons/find-person-by-document.use-case';

@ApiTags('Persons')
@Controller('persons')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PersonsController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly getPersonsUseCase: GetPersonsUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
    private readonly deletePersonUseCase: DeletePersonUseCase,
    private readonly findPersonByDocumentUseCase: FindPersonByDocumentUseCase,
  ) {}

  @Post()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Persona creada exitosamente',
    type: PersonResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El documento o email ya existe' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    return await this.createPersonUseCase.execute(createPersonDto);
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener personas paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por nombre o apellido' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de personas obtenida exitosamente',
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
  ): Promise<PaginatedResponseDto<PersonResponseDto>> {
    return await this.getPersonsUseCase.execute(page, limit, search);
  }

  @Get('document/:documentNumber')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar persona por número de documento' })
  @ApiParam({ name: 'documentNumber', description: 'Número de documento' })
  @ApiQuery({ name: 'documentType', required: false, type: String, description: 'Tipo de documento' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Persona encontrada',
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Persona no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findByDocument(
    @Param('documentNumber') documentNumber: string,
    @Query('documentType') documentType?: string,
  ): Promise<PersonResponseDto> {
    return await this.findPersonByDocumentUseCase.execute(documentNumber, documentType);
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una persona por ID' })
  @ApiParam({ name: 'id', description: 'ID de la persona' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Persona obtenida exitosamente',
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Persona no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Acceso prohibido' 
  })
  async findOne(@Param('id') id: string): Promise<PersonResponseDto> {
    return await this.getPersonUseCase.execute(id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una persona' })
  @ApiParam({ name: 'id', description: 'ID de la persona' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Persona actualizada exitosamente',
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Persona no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El documento o email ya existe' 
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
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return await this.updatePersonUseCase.execute(id, updatePersonDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una persona' })
  @ApiParam({ name: 'id', description: 'ID de la persona' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Persona eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Persona no encontrada' 
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
    await this.deletePersonUseCase.execute(id);
  }
}
