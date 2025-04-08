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
import {CreateBusinessDto} from 'src/application/dtos/general/business/create-business-dto';
import {UpdateBusinessDto} from 'src/application/dtos/general/business/update-business-dto';
import {BusinessResponseDto} from 'src/application/dtos/general/business/business-response-dto';
import {PaginatedResponseDto} from 'src/application/dtos/paginated-response-dto';

// Use Cases de Negocios
import {CreateBusinessUseCase} from 'src/application/use-cases/general/businesses/create-business-use-case';
import {GetBusinessUseCase} from 'src/application/use-cases/general/businesses/get-business-use-case';
import {GetBusinessesUseCase} from 'src/application/use-cases/general/businesses/get-businesses-use-case';
import {UpdateBusinessUseCase} from 'src/application/use-cases/general/businesses/update-business-use-case';
import {DeleteBusinessUseCase} from 'src/application/use-cases/general/businesses/delete-business-use-case';
import {FindBusinessByTaxIdUseCase} from 'src/application/use-cases/general/businesses/find-business-by-tax-id-use-case';
import {FindBusinessByIndustryUseCase} from 'src/application/use-cases/general/businesses/find-business-by-industry-use-case';
import {FindBusinessByContactPersonUseCase} from 'src/application/use-cases/general/businesses/find-business-by-contact-person-use-case';
import {FindBusinessByNameUseCase} from 'src/application/use-cases/general/businesses/find-business-by-name-use-case';
import {FindBusinessByTypeUseCase} from 'src/application/use-cases/general/businesses/find-business-by-type-use-case';
import {SetBusinessActiveStatusUseCase} from 'src/application/use-cases/general/businesses/set-business-active-status-use-case';

@ApiTags('Businesses')
@ApiBearerAuth()
@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BusinessesController {
	constructor(
		private readonly createBusinessUseCase: CreateBusinessUseCase,
		private readonly getBusinessUseCase: GetBusinessUseCase,
		private readonly getBusinessesUseCase: GetBusinessesUseCase,
		private readonly updateBusinessUseCase: UpdateBusinessUseCase,
		private readonly deleteBusinessUseCase: DeleteBusinessUseCase,
		private readonly findBusinessByTaxIdUseCase: FindBusinessByTaxIdUseCase,
		private readonly findBusinessByIndustryUseCase: FindBusinessByIndustryUseCase,
		private readonly findBusinessByContactPersonUseCase: FindBusinessByContactPersonUseCase,
		private readonly findBusinessByNameUseCase: FindBusinessByNameUseCase,
		private readonly findBusinessByTypeUseCase: FindBusinessByTypeUseCase,
		private readonly setBusinessActiveStatusUseCase: SetBusinessActiveStatusUseCase,
	) {}

	@Get()
	@ApiOperation({summary: 'Listar empresas paginadas'})
	@ApiResponse({status: 200, description: 'Lista de empresas obtenida con éxito'})
	@ApiQuery({name: 'page', required: false, type: Number, description: 'Número de página'})
	@ApiQuery({name: 'limit', required: false, type: Number, description: 'Elementos por página'})
	@ApiQuery({name: 'search', required: false, type: String, description: 'Búsqueda por nombre'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findAll(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
		@Query('search') search?: string,
		@Query('filter') filterStr?: string,
	): Promise<PaginatedResponseDto<BusinessResponseDto>> {
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
				'name',
				'legalName',
				'taxId',
				'type',
				'industry',
				'website',
				'email',
				'phone',
				'secondaryPhone',
				'address.street',
				'address.city',
				'address.state',
				'address.country',
				'address.postalCode',
				'billingAddress.street',
				'billingAddress.city',
				'billingAddress.state',
				'billingAddress.country',
				'billingAddress.postalCode',
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

		return this.getBusinessesUseCase.execute(filter, page, limit);
	}

	@Get('by-name/:name')
	@ApiOperation({summary: 'Buscar empresas por nombre'})
	@ApiResponse({status: 200, description: 'Empresas encontradas con éxito'})
	@ApiParam({name: 'name', description: 'Nombre completo o parcial de la empresa'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findByName(@Param('name') name: string): Promise<BusinessResponseDto[]> {
		return this.findBusinessByNameUseCase.execute(name);
	}

	@Get('by-tax-id/:taxId')
	@ApiOperation({summary: 'Buscar empresa por identificador fiscal'})
	@ApiResponse({status: 200, description: 'Empresa encontrada con éxito'})
	@ApiResponse({status: 404, description: 'Empresa no encontrada'})
	@ApiParam({name: 'taxId', description: 'Identificador fiscal'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findByTaxId(@Param('taxId') taxId: string): Promise<BusinessResponseDto> {
		return this.findBusinessByTaxIdUseCase.execute(taxId);
	}

	@Get('by-industry/:industry')
	@ApiOperation({summary: 'Buscar empresas por industria'})
	@ApiResponse({status: 200, description: 'Empresas encontradas con éxito'})
	@ApiParam({name: 'industry', description: 'Industria o sector'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findByIndustry(@Param('industry') industry: string): Promise<BusinessResponseDto[]> {
		return this.findBusinessByIndustryUseCase.execute(industry);
	}

	@Get('by-type/:type')
	@ApiOperation({summary: 'Buscar empresas por tipo'})
	@ApiResponse({status: 200, description: 'Empresas encontradas con éxito'})
	@ApiParam({name: 'type', description: 'Tipo de empresa'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findByType(@Param('type') type: string): Promise<BusinessResponseDto[]> {
		return this.findBusinessByTypeUseCase.execute(type);
	}

	@Get('by-contact-person/:personId')
	@ApiOperation({summary: 'Buscar empresas por persona de contacto'})
	@ApiResponse({status: 200, description: 'Empresas encontradas con éxito'})
	@ApiParam({name: 'personId', description: 'ID de la persona de contacto'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findByContactPerson(@Param('personId') personId: string): Promise<BusinessResponseDto[]> {
		return this.findBusinessByContactPersonUseCase.execute(personId);
	}

	@Get(':id')
	@ApiOperation({summary: 'Obtener una empresa por ID'})
	@ApiResponse({status: 200, description: 'Empresa obtenida con éxito'})
	@ApiResponse({status: 404, description: 'Empresa no encontrada'})
	@ApiParam({name: 'id', description: 'ID de la empresa'})
	@Roles('admin', 'business-manager', 'user')
	@Permissions('businesses:read')
	async findOne(@Param('id') id: string): Promise<BusinessResponseDto> {
		return this.getBusinessUseCase.execute(id);
	}

	@Post()
	@ApiOperation({summary: 'Crear una nueva empresa'})
	@ApiResponse({status: 201, description: 'Empresa creada con éxito'})
	@ApiResponse({status: 400, description: 'Datos inválidos'})
	@HttpCode(HttpStatus.CREATED)
	@Roles('admin', 'business-manager')
	@Permissions('businesses:create')
	async create(@Body() createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
		return this.createBusinessUseCase.execute(createBusinessDto);
	}

	@Put(':id')
	@ApiOperation({summary: 'Actualizar una empresa'})
	@ApiResponse({status: 200, description: 'Empresa actualizada con éxito'})
	@ApiResponse({status: 404, description: 'Empresa no encontrada'})
	@ApiParam({name: 'id', description: 'ID de la empresa'})
	@Roles('admin', 'business-manager')
	@Permissions('businesses:update')
	async update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto): Promise<BusinessResponseDto> {
		return this.updateBusinessUseCase.execute(id, updateBusinessDto);
	}

	@Patch(':id/active-status')
	@ApiOperation({summary: 'Cambiar el estado de activación de una empresa'})
	@ApiResponse({status: 200, description: 'Estado de activación cambiado con éxito'})
	@ApiResponse({status: 404, description: 'Empresa no encontrada'})
	@ApiParam({name: 'id', description: 'ID de la empresa'})
	@Roles('admin', 'business-manager')
	@Permissions('businesses:update')
	async setActiveStatus(@Param('id') id: string, @Body() body: {isActive: boolean}): Promise<BusinessResponseDto> {
		return this.setBusinessActiveStatusUseCase.execute(id, body.isActive);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Eliminar una empresa'})
	@ApiResponse({status: 200, description: 'Empresa eliminada con éxito'})
	@ApiResponse({status: 404, description: 'Empresa no encontrada'})
	@ApiParam({name: 'id', description: 'ID de la empresa'})
	@Roles('admin')
	@Permissions('businesses:delete')
	async remove(@Param('id') id: string): Promise<void> {
		return this.deleteBusinessUseCase.execute(id);
	}
}
