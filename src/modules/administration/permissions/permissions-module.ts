import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PermissionSchema} from 'src/infrastructure/database/mongodb/schemas/administration/permission-schema';
import {PermissionRepositoryImpl} from 'src/infrastructure/repositories/mongodb/administration/permission-repository-impl';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionsController} from 'src/presentation/controllers/administration/permissions-controller';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {CreatePermissionUseCase} from 'src/application/use-cases/administration/permissions/create-permission-use-case';
@Module({
	imports: [MongooseModule.forFeature([{name: 'Permission', schema: PermissionSchema}])],
	controllers: [PermissionsController],
	providers: [
		// Repositorios
		{
			provide: PermissionRepository,
			useClass: PermissionRepositoryImpl,
		},

		// Mappers
		PermissionMapper,

		// Casos de uso
		CreatePermissionUseCase,
		GetPermissionUseCase,
		GetPermissionsUseCase,
		UpdatePermissionUseCase,
		DeletePermissionUseCase,
		GetPermissionsByGroupUseCase,
		GetPermissionGroupsUseCase,
	],
	exports: [PermissionRepository, CreatePermissionUseCase, GetPermissionUseCase, GetPermissionsUseCase, UpdatePermissionUseCase, DeletePermissionUseCase],
})
export class PermissionsModule {}
