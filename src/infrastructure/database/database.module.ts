import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {UnitOfWork} from './unit-of-work';

// Importaciones de schemas
import {UserSchema} from './mongodb/schemas/administration/user.schema';

// Importaciones de repositorios
import {UserRepositoryImpl} from '../repositories/mongodb/administration/user.repository.impl';
import {RoleRepositoryImpl} from '../repositories/mongodb/administration/role-repository-impl';
import {PermissionRepositoryImpl} from '../repositories/mongodb/administration/permission-repository-impl';
import {PersonRepositoryImpl} from '../repositories/mongodb/general/person-repository-impl';
import {BusinessRepositoryImpl} from '../repositories/mongodb/general/business-repository-impl';

// Interfaces de repositorio
import {UserRepository} from 'src/domain/repositories/administration/user.repository';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';

import {RoleSchema} from './mongodb/schemas/administration/role-schema';
import {PermissionSchema} from './mongodb/schemas/administration/permission-schema';
import {PersonSchema} from './mongodb/schemas/general/person-schema';
import {BusinessSchema} from './mongodb/schemas/general/business-schema';
import {DatabaseService} from './database.service';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{name: 'User', schema: UserSchema},
			{name: 'Role', schema: RoleSchema},
			{name: 'Permission', schema: PermissionSchema},
			{name: 'Person', schema: PersonSchema},
			{name: 'Business', schema: BusinessSchema},
		]),
	],
	providers: [
		DatabaseService,
		UnitOfWork,
		{
			provide: UserRepository,
			useClass: UserRepositoryImpl,
		},
		{
			provide: RoleRepository,
			useClass: RoleRepositoryImpl,
		},
		{
			provide: PermissionRepository,
			useClass: PermissionRepositoryImpl,
		},
		{
			provide: PersonRepository,
			useClass: PersonRepositoryImpl,
		},
		{
			provide: BusinessRepository,
			useClass: BusinessRepositoryImpl,
		},
	],
	exports: [DatabaseService, UnitOfWork, UserRepository, RoleRepository, PermissionRepository, PersonRepository, BusinessRepository],
})
export class DatabaseModule {}
