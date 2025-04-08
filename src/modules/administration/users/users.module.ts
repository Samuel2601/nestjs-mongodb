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
import {UserMapper} from 'src/application/mappers/administration/user-mapper';
import {GetUserUseCase} from 'src/application/use-cases/administration/users/get-user-use-case';
import {UpdateUserUseCase} from 'src/application/use-cases/administration/users/update-user-use-case';
import {DeleteUserUseCase} from 'src/application/use-cases/administration/users/delete-user-use-case';
import {ListUsersUseCase} from 'src/application/use-cases/administration/users/list-users-use-case';
import {UpdateUserRolesUseCase} from 'src/application/use-cases/administration/users/update-user-roles-use-case';
import {ToggleUserStatusUseCase} from 'src/application/use-cases/administration/users/toggle-user-status-use-case';
import {ChangePasswordUseCase} from 'src/application/use-cases/administration/users/change-password-use-case';
import {ResetPasswordUseCase} from 'src/application/use-cases/administration/users/reset-password-use-case';
import {RecordUserLoginUseCase} from 'src/application/use-cases/administration/users/record-user-login-use-case';
import {GetUserPermissionsUseCase} from 'src/application/use-cases/administration/users/get-user-permissions-use-case';
import {VerifyUserPermissionUseCase} from 'src/application/use-cases/administration/users/verify-user-permission-use-case';
import {VerifyUserRoleUseCase} from 'src/application/use-cases/administration/users/verify-user-role-use-case';

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
		UpdateUserUseCase,
		DeleteUserUseCase,
		ListUsersUseCase,
		UpdateUserRolesUseCase,
		ToggleUserStatusUseCase,
		ChangePasswordUseCase,
		ResetPasswordUseCase,
		RecordUserLoginUseCase,
		GetUserPermissionsUseCase,
		VerifyUserPermissionUseCase,
		VerifyUserRoleUseCase,
	],
	exports: [
		UserRepository,
		CreateUserUseCase,
		GetUserUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
		ListUsersUseCase,
		UpdateUserRolesUseCase,
		ToggleUserStatusUseCase,
		ChangePasswordUseCase,
		ResetPasswordUseCase,
		RecordUserLoginUseCase,
	],
})
export class UsersModule {}
