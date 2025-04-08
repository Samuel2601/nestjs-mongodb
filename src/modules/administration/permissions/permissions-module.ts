import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PermissionSchema} from 'src/infrastructure/database/mongodb/schemas/administration/permission-schema';
import {PermissionRepositoryImpl} from 'src/infrastructure/repositories/mongodb/administration/permission-repository-impl';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PermissionsController} from 'src/presentation/controllers/administration/permissions-controller';
import {PermissionMapper} from 'src/application/mappers/administration/permission-mapper';
import {CreatePermissionUseCase} from 'src/application/use-cases/administration/permissions/create-permission-use-case';
import {GetPermissionUseCase} from 'src/application/use-cases/administration/permissions/get-permission-use-case';
import {UpdatePermissionUseCase} from 'src/application/use-cases/administration/permissions/update-permission-use-case';
import {DeletePermissionUseCase} from 'src/application/use-cases/administration/permissions/delete-permission-use-case';
import {ListPermissionsUseCase} from 'src/application/use-cases/administration/permissions/list-permissions-use-case';
import {GetSystemPermissionsUseCase} from 'src/application/use-cases/administration/permissions/get-system-permissions-use-case';
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
		UpdatePermissionUseCase,
		DeletePermissionUseCase,
		ListPermissionsUseCase,
		GetSystemPermissionsUseCase,
	],
	exports: [
		PermissionRepository,
		CreatePermissionUseCase,
		GetPermissionUseCase,
		UpdatePermissionUseCase,
		DeletePermissionUseCase,
		ListPermissionsUseCase,
		GetSystemPermissionsUseCase,
	],
})
export class PermissionsModule {}
