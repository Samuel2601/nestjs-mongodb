import {Module} from '@nestjs/common';
import {PersonsModule} from './persons/persons-module';
import {BusinessesModule} from './businesses/businesses-module';

/**
 * Módulo que agrupa los módulos de entidades generales
 */
@Module({
	imports: [PersonsModule, BusinessesModule],
	exports: [PersonsModule, BusinessesModule],
})
export class GeneralModule {}
