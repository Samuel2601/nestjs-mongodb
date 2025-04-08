// Importaciones de NestJS Core
import {Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpStatus, HttpCode} from '@nestjs/common';

// Importaciones de Swagger
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

// Guards
import {JwtAuthGuard} from 'src/presentation/guards/auth/jwt-auth.guard';
import {RolesGuard} from 'src/presentation/guards/roles.guard';
import {PermissionsGuard} from 'src/presentation/guards/permissions.guard';

// Decoradores
import {Roles} from 'src/presentation/decorators/roles-decorator';
import {Permissions} from 'src/presentation/decorators/permissions-decorator';

// DTOs
import {CreatePersonDto} from 'src/application/dtos/general/person/create-person-dto';
import {UpdatePersonDto} from 'src/application/dtos/general/person/update-person-dto';
import {PersonResponseDto} from 'src/application/dtos/general/person/person-response-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';

// Use Cases de Personas
import {CreatePersonUseCase} from 'src/application/use-cases/general/persons/create-person-use-case';
import {GetPersonUseCase} from 'src/application/use-cases/general/persons/get-person-use-case';
import {GetPersonsUseCase} from 'src/application/use-cases/general/persons/get-persons-use-case';
import {UpdatePersonUseCase} from 'src/application/use-cases/general/persons/update-person-use-case';
import {DeletePersonUseCase} from 'src/application/use-cases/general/persons/delete-person-use-case';
import {FindPersonByDocumentUseCase} from 'src/application/use-cases/general/persons/find-person-by-document-use-case';
import {FindPersonByEmailUseCase} from 'src/application/use-cases/general/persons/find-person-by-email-use-case';
import {FindPersonByNameUseCase} from 'src/application/use-cases/general/persons/find-person-by-name-use-case';
@ApiTags('Persons')
@Controller('persons')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class PersonsController {
	constructor(
		private readonly createPersonUseCase: CreatePersonUseCase,
		private readonly getPersonUseCase: GetPersonUseCase,
		private readonly getPersonsUseCase: GetPersonsUseCase,
		private readonly updatePersonUseCase: UpdatePersonUseCase,
		private readonly deletePersonUseCase: DeletePersonUseCase,
		private readonly findPersonByDocumentUseCase: FindPersonByDocumentUseCase,
		private readonly findPersonByEmailUseCase: FindPersonByEmailUseCase,
		private readonly findPersonByNameUseCase: FindPersonByNameUseCase,
	) {}

	@Get()
	@ApiOperation({summary: 'Listar personas paginadas'})
	@ApiResponse({status: 200, description: 'Lista de personas obtenida con éxito'})
	@ApiQuery({name: 'page', required: false, type: Number, description: 'Número de página'})
	@ApiQuery({name: 'limit', required: false, type: Number, description: 'Elementos por página'})
	@ApiQuery({name: 'search', required: false, type: String, description: 'Búsqueda general en campos de texto'})
	@ApiQuery({name: 'filter', required: false, type: String, description: 'Filtro avanzado en formato JSON (compatible con MongoDB)'})
	@Roles('admin', 'user')
	@Permissions('persons:read')
	async findAll(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
		@Query('search') search?: string,
		@Query('filter') filterStr?: string,
	): Promise<PaginatedResponseDto<PersonResponseDto>> {
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
			const textFields = [
				'firstName',
				'lastName',
				'documentNumber',
				'documentType',
				'email',
				'phone',
				'mobilePhone',
				'address.street',
				'address.city',
				'address.state',
				'address.country',
				'address.postalCode',
			];

			// Creamos una condición $or para buscar en todos los campos de texto
			const searchConditions = textFields.map((field) => ({[field]: searchRegex}));

			// Si ya existe un filtro, lo combinamos con la búsqueda usando $and
			if (Object.keys(filter).length > 0) {
				filter = {$and: [filter, {$or: searchConditions}]};
			} else {
				filter = {$or: searchConditions};
			}
		}

		return this.getPersonsUseCase.execute(filter, page, limit);
	}

	@Get('by-document/:documentNumber')
	@ApiOperation({summary: 'Buscar persona por número de documento'})
	@ApiResponse({status: 200, description: 'Persona encontrada con éxito'})
	@ApiResponse({status: 404, description: 'Persona no encontrada'})
	@ApiParam({name: 'documentNumber', description: 'Número de documento'})
	@ApiQuery({name: 'documentType', required: false, type: String, description: 'Tipo de documento'})
	@Roles('admin', 'user')
	@Permissions('persons:read')
	async findByDocument(@Param('documentNumber') documentNumber: string, @Query('documentType') documentType?: string): Promise<PersonResponseDto> {
		return this.findPersonByDocumentUseCase.execute(documentNumber, documentType);
	}

	@Get('by-email/:email')
	@ApiOperation({summary: 'Buscar persona por correo electrónico'})
	@ApiResponse({status: 200, description: 'Persona encontrada con éxito'})
	@ApiResponse({status: 404, description: 'Persona no encontrada'})
	@ApiParam({name: 'email', description: 'Correo electrónico'})
	@Roles('admin', 'user')
	@Permissions('persons:read')
	async findByEmail(@Param('email') email: string): Promise<PersonResponseDto> {
		return this.findPersonByEmailUseCase.execute(email);
	}

	@Get('by-name')
	@ApiOperation({summary: 'Buscar personas por nombre y apellido'})
	@ApiResponse({status: 200, description: 'Personas encontradas con éxito'})
	@ApiQuery({name: 'firstName', required: true, type: String, description: 'Nombre'})
	@ApiQuery({name: 'lastName', required: true, type: String, description: 'Apellido'})
	@Roles('admin', 'user')
	@Permissions('persons:read')
	async findByName(@Query('firstName') firstName: string, @Query('lastName') lastName: string): Promise<PersonResponseDto[]> {
		return this.findPersonByNameUseCase.execute(firstName, lastName);
	}

	@Get(':id')
	@ApiOperation({summary: 'Obtener una persona por ID'})
	@ApiResponse({status: 200, description: 'Persona obtenida con éxito'})
	@ApiResponse({status: 404, description: 'Persona no encontrada'})
	@ApiParam({name: 'id', description: 'ID de la persona'})
	@Roles('admin', 'user')
	@Permissions('persons:read')
	async findOne(@Param('id') id: string): Promise<PersonResponseDto> {
		return this.getPersonUseCase.execute(id);
	}

	@Post()
	@ApiOperation({summary: 'Crear una nueva persona'})
	@ApiResponse({status: 201, description: 'Persona creada con éxito'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@ApiResponse({status: 409, description: 'El documento o correo electrónico ya existe'})
	@HttpCode(HttpStatus.CREATED)
	@Roles('admin', 'user')
	@Permissions('persons:create')
	async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
		return this.createPersonUseCase.execute(createPersonDto);
	}

	@Put(':id')
	@ApiOperation({summary: 'Actualizar una persona'})
	@ApiResponse({status: 200, description: 'Persona actualizada con éxito'})
	@ApiResponse({status: 404, description: 'Persona no encontrada'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@ApiResponse({status: 409, description: 'El documento o correo electrónico ya existe'})
	@ApiParam({name: 'id', description: 'ID de la persona'})
	@Roles('admin', 'user')
	@Permissions('persons:update')
	async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto): Promise<PersonResponseDto> {
		return this.updatePersonUseCase.execute(id, updatePersonDto);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Eliminar una persona'})
	@ApiResponse({status: 204, description: 'Persona eliminada con éxito'})
	@ApiResponse({status: 404, description: 'Persona no encontrada'})
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({name: 'id', description: 'ID de la persona'})
	@Roles('admin')
	@Permissions('persons:delete')
	async remove(@Param('id') id: string): Promise<void> {
		return this.deletePersonUseCase.execute(id);
	}
}
