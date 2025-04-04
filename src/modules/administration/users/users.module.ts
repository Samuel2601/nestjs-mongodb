import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

// Controllers
import {UsersController} from '../../../presentation/controllers/administration/users.controller';

// Schemas
import {UserSchema} from '../../../infrastructure/database/mongodb/schemas/administration/user.schema';

// Repositories
import {UserRepository} from '../../../domain/repositories/administration/user.repository';
import {UserRepositoryImpl} from '../../../infrastructure/repositories/mongodb/administration/user.repository.impl';

// Mappers

// Use Cases
import {CreateUserUseCase} from '../../../application/use-cases/administration/users/create-user.use-case';
import { UserMapper } from 'src/application/mappers/administration/user-mapper';
import { GetUserUseCase } from 'src/application/use-cases/administration/users/get-user-use-case';

@Module({
	imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
	controllers: [UsersController],
	providers: [
		// Repositorios
		{
			provide: UserRepository,
			useClass: UserRepositoryImpl,
		},

		// Mappers
		UserMapper,

		// Casos de uso
		CreateUserUseCase,
		GetUserUseCase,
		GetUsersUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
	],
	exports: [UserRepository, CreateUserUseCase, GetUserUseCase, GetUsersUseCase, UpdateUserUseCase, DeleteUserUseCase],
})
export class UsersModule {}
