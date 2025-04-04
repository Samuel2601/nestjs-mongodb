import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PersonMapper} from 'src/application/mappers/general/person-mapper';
import {CreatePersonUseCase} from 'src/application/use-cases/general/persons/create-person-use-case';
import {DeletePersonUseCase} from 'src/application/use-cases/general/persons/delete-person-use-case';
import {FindPersonByDocumentUseCase} from 'src/application/use-cases/general/persons/find-person-by-document-use-case';
import {FindPersonByEmailUseCase} from 'src/application/use-cases/general/persons/find-person-by-email-use-case';
import {FindPersonByNameUseCase} from 'src/application/use-cases/general/persons/find-person-by-name-use-case';
import {GetPersonUseCase} from 'src/application/use-cases/general/persons/get-person-use-case';
import {GetPersonsUseCase} from 'src/application/use-cases/general/persons/get-persons-use-case';
import {UpdatePersonUseCase} from 'src/application/use-cases/general/persons/update-person-use-case';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {PersonSchema} from 'src/infrastructure/database/mongodb/schemas/general/person-schema';
import {PersonRepositoryImpl} from 'src/infrastructure/repositories/mongodb/general/person-repository-impl';
import {PersonsController} from 'src/presentation/controllers/general/persons-controller';

@Module({
	imports: [MongooseModule.forFeature([{name: 'Person', schema: PersonSchema}])],
	controllers: [PersonsController],
	providers: [
		// Repositorios
		{
			provide: PersonRepository,
			useClass: PersonRepositoryImpl,
		},

		// Mappers
		PersonMapper,

		// Casos de uso
		CreatePersonUseCase,
		GetPersonUseCase,
		GetPersonsUseCase,
		UpdatePersonUseCase,
		DeletePersonUseCase,
		// Otros casos de uso
		FindPersonByNameUseCase,
		FindPersonByDocumentUseCase,
		FindPersonByEmailUseCase,
		// Otros casos de uso
	],
	exports: [
		PersonRepository,
		CreatePersonUseCase,
		GetPersonUseCase,
		GetPersonsUseCase,
		UpdatePersonUseCase,
		DeletePersonUseCase,
		FindPersonByDocumentUseCase,
		FindPersonByEmailUseCase,
		FindPersonByNameUseCase,
	],
})
export class PersonsModule {}
