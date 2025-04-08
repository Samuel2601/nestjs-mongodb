import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {GetRolesByPermissionUseCase} from 'src/application/use-cases/administration/roles/get-roles-by-permission-use-case';
import {CreateRoleUseCase} from 'src/application/use-cases/administration/roles/create-role-use-case';
import {DeleteRoleUseCase} from 'src/application/use-cases/administration/roles/delete-role-use-case';
import {GetRoleUseCase} from 'src/application/use-cases/administration/roles/get-role-use-case';
import {GetSystemRolesUseCase} from 'src/application/use-cases/administration/roles/get-system-roles-use-case';
import {ListRolesUseCase} from 'src/application/use-cases/administration/roles/list-roles-use-case';
import {UpdateRoleUseCase} from 'src/application/use-cases/administration/roles/update-role-use-case';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {RoleSchema} from 'src/infrastructure/database/mongodb/schemas/administration/role-schema';
import {RoleRepositoryImpl} from 'src/infrastructure/repositories/mongodb/administration/role-repository-impl';
import {RolesController} from 'src/presentation/controllers/administration/roles-controller';
import { AssignPermissionsToRoleUseCase } from 'src/application/use-cases/administration/roles/assign-permissions-to-role-use-case';
import { GetPermissionsByRoleUseCase } from 'src/application/use-cases/administration/roles/get-permissions-by-role-use-case';

@Module({
	imports: [MongooseModule.forFeature([{name: 'Role', schema: RoleSchema}])],
	controllers: [RolesController],
	providers: [
		// Repositorios
		{
			provide: RoleRepository,
			useClass: RoleRepositoryImpl,
		},

		// Mappers
		RoleMapper,

		// Casos de uso
		CreateRoleUseCase,
		GetRoleUseCase,
		UpdateRoleUseCase,
		DeleteRoleUseCase,
		ListRolesUseCase,
		GetSystemRolesUseCase,
		GetRolesByPermissionUseCase,
		AssignPermissionsToRoleUseCase,
		GetPermissionsByRoleUseCase
	],
	exports: [RoleRepository, CreateRoleUseCase, GetRoleUseCase, UpdateRoleUseCase, DeleteRoleUseCase, ListRolesUseCase, GetSystemRolesUseCase, GetRolesByPermissionUseCase],
})
export class RolesModule {}
