import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {BusinessMapper} from 'src/application/mappers/general/business-mapper';
import {CreateBusinessUseCase} from 'src/application/use-cases/general/businesses/create-business-use-case';
import {DeleteBusinessUseCase} from 'src/application/use-cases/general/businesses/delete-business-use-case';
import {FindBusinessByIndustryUseCase} from 'src/application/use-cases/general/businesses/find-business-by-industry-use-case';
import {FindBusinessByNameUseCase} from 'src/application/use-cases/general/businesses/find-business-by-name-use-case';
import {FindBusinessByTaxIdUseCase} from 'src/application/use-cases/general/businesses/find-business-by-tax-id-use-case';
import {FindBusinessByTypeUseCase} from 'src/application/use-cases/general/businesses/find-business-by-type-use-case';
import {GetBusinessUseCase} from 'src/application/use-cases/general/businesses/get-business-use-case';
import {GetBusinessesUseCase} from 'src/application/use-cases/general/businesses/get-businesses-use-case';
import {SetBusinessActiveStatusUseCase} from 'src/application/use-cases/general/businesses/set-business-active-status-use-case';
import {UpdateBusinessUseCase} from 'src/application/use-cases/general/businesses/update-business-use-case';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {BusinessSchema} from 'src/infrastructure/database/mongodb/schemas/general/business-schema';
import {BusinessRepositoryImpl} from 'src/infrastructure/repositories/mongodb/general/business-repository-impl';
import {BusinessesController} from 'src/presentation/controllers/general/businesses-controller';

@Module({
	imports: [MongooseModule.forFeature([{name: 'Business', schema: BusinessSchema}])],
	controllers: [BusinessesController],
	providers: [
		// Repositorios
		{
			provide: BusinessRepository,
			useClass: BusinessRepositoryImpl,
		},

		// Mappers
		BusinessMapper,

		// Casos de uso
		CreateBusinessUseCase,
		GetBusinessesUseCase,
		GetBusinessUseCase,
		UpdateBusinessUseCase,
		// Otros casos de uso
		FindBusinessByTaxIdUseCase,
		FindBusinessByIndustryUseCase,
		FindBusinessByNameUseCase,
		FindBusinessByTaxIdUseCase,
		FindBusinessByTypeUseCase,
		DeleteBusinessUseCase,
		SetBusinessActiveStatusUseCase,
	],
	exports: [
		BusinessRepository,
		BusinessMapper,
		CreateBusinessUseCase,
		GetBusinessesUseCase,
		GetBusinessUseCase,
		UpdateBusinessUseCase,
		DeleteBusinessUseCase,
		FindBusinessByTaxIdUseCase,
		FindBusinessByIndustryUseCase,
		FindBusinessByNameUseCase,
		FindBusinessByTaxIdUseCase,
		FindBusinessByTypeUseCase,
		SetBusinessActiveStatusUseCase,
	],
})
export class BusinessesModule {}
