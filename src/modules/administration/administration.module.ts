import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {RolesModule} from './roles/roles-module';
import {PermissionsModule} from './permissions/permissions-module';

/**
 * Módulo que agrupa los módulos de administración
 */
@Module({
	imports: [UsersModule, RolesModule, PermissionsModule],
	exports: [UsersModule, RolesModule, PermissionsModule],
})
export class AdministrationModule {}
