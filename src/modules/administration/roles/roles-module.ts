import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {RoleMapper} from 'src/application/mappers/administration/role-mapper';
import {CreateRoleUseCase} from 'src/application/use-cases/administration/roles/create-role-use-case';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {RoleSchema} from 'src/infrastructure/database/mongodb/schemas/administration/role-schema';
import {RoleRepositoryImpl} from 'src/infrastructure/repositories/mongodb/administration/role-repository-impl';
import {RolesController} from 'src/presentation/controllers/administration/roles-controller';

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
		GetRolesUseCase,
		UpdateRoleUseCase,
		DeleteRoleUseCase,
		UpdateRolePermissionsUseCase,
	],
	exports: [RoleRepository, CreateRoleUseCase, GetRoleUseCase, GetRolesUseCase, UpdateRoleUseCase, DeleteRoleUseCase],
})
export class RolesModule {}
