import {Logger} from '@nestjs/common';
import {Document, FilterQuery, Model, ProjectionType, QueryOptions, Types, UpdateQuery} from 'mongoose';
import {BusinessException} from 'src/common/exceptions/business-exception';

export abstract class BaseRepository<T extends Document> {
	protected readonly logger: Logger;

	constructor(
		protected readonly entityModel: Model<T>,
		protected readonly modelName: string,
	) {
		this.logger = new Logger(`${modelName}Repository`);
	}

	/**
	 * Crea un nuevo documento
	 * @param data Datos del documento a crear
	 * @param session Sesión de transacción opcional
	 * @returns Documento creado
	 */
	async create(data: Partial<T>, session?: any): Promise<T> {
		try {
			const createdEntity = new this.entityModel(data);

			if (session) {
				createdEntity.$session(session);
			}

			return await createdEntity.save();
		} catch (error) {
			this.logger.error(`Error creating ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error creating ${this.modelName}`, error);
		}
	}

	/**
	 * Crea múltiples documentos
	 * @param data Array de datos para crear documentos
	 * @param session Sesión de transacción opcional
	 * @returns Array de documentos creados
	 */
	async createMany(data: Partial<T>[], session?: any): Promise<T[]> {
		try {
			const options = session ? {session} : {};
			return (await this.entityModel.insertMany(data, options)) as unknown as T[];
		} catch (error) {
			this.logger.error(`Error creating many ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error creating many ${this.modelName}`, error);
		}
	}

	/**
	 * Encuentra un documento por ID
	 * @param id ID del documento
	 * @param projection Campos a seleccionar
	 * @returns Documento encontrado o null
	 */
	async findById(id: string | Types.ObjectId, projection?: ProjectionType<T>): Promise<T | null> {
		try {
			return await this.entityModel.findById(id, projection).exec();
		} catch (error) {
			this.logger.error(`Error finding ${this.modelName} by id: ${error.message}`, error.stack);
			throw new BusinessException(`Error finding ${this.modelName}`, error);
		}
	}

	/**
	 * Encuentra un documento por un filtro específico
	 * @param filter Filtro de búsqueda
	 * @param projection Campos a seleccionar
	 * @returns Documento encontrado o null
	 */
	async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>): Promise<T | null> {
		try {
			return await this.entityModel.findOne(filter, projection).exec();
		} catch (error) {
			this.logger.error(`Error finding ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error finding ${this.modelName}`, error);
		}
	}

	/**
	 * Encuentra todos los documentos que coinciden con un filtro
	 * @param filter Filtro de búsqueda
	 * @param projection Campos a seleccionar
	 * @param options Opciones de consulta (sort, skip, limit)
	 * @returns Array de documentos
	 */
	async find(filter: FilterQuery<T> = {}, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T[]> {
		try {
			return await this.entityModel.find(filter, projection, options).exec();
		} catch (error) {
			this.logger.error(`Error finding ${this.modelName} documents: ${error.message}`, error.stack);
			throw new BusinessException(`Error finding ${this.modelName} documents`, error);
		}
	}

	/**
	 * Encuentra documentos con paginación
	 * @param filter Filtro de búsqueda
	 * @param page Número de página
	 * @param limit Límite de documentos por página
	 * @param projection Campos a seleccionar
	 * @param sort Ordenamiento
	 * @returns Objeto con datos paginados
	 */
	async findPaginated(
		filter: FilterQuery<T> = {},
		page = 1,
		limit = 10,
		projection?: ProjectionType<T>,
		sort?: Record<string, 1 | -1>,
	): Promise<{data: T[]; total: number; page: number; limit: number; totalPages: number}> {
		try {
			const skip = (page - 1) * limit;

			const [data, total] = await Promise.all([
				this.entityModel.find(filter, projection).sort(sort).skip(skip).limit(limit).exec(),
				this.entityModel.countDocuments(filter).exec(),
			]);

			return {
				data,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			};
		} catch (error) {
			this.logger.error(`Error finding paginated ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error finding paginated ${this.modelName}`, error);
		}
	}

	/**
	 * Actualiza un documento por ID
	 * @param id ID del documento
	 * @param updateData Datos a actualizar
	 * @param session Sesión de transacción opcional
	 * @returns Documento actualizado
	 */
	async update(id: string | Types.ObjectId, updateData: UpdateQuery<T>, session?: any): Promise<T | null> {
		try {
			const options = {new: true, session};
			return await this.entityModel.findByIdAndUpdate(id, updateData, options).exec();
		} catch (error) {
			this.logger.error(`Error updating ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error updating ${this.modelName}`, error);
		}
	}

	/**
	 * Actualiza varios documentos que coinciden con un filtro
	 * @param filter Filtro para seleccionar documentos
	 * @param updateData Datos a actualizar
	 * @param session Sesión de transacción opcional
	 * @returns Resultado de la operación
	 */
	async updateMany(filter: FilterQuery<T>, updateData: UpdateQuery<T>, session?: any): Promise<{modifiedCount: number}> {
		try {
			const options = session ? {session} : {};
			const result = await this.entityModel.updateMany(filter, updateData, options).exec();
			return {modifiedCount: result.modifiedCount};
		} catch (error) {
			this.logger.error(`Error updating many ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error updating many ${this.modelName}`, error);
		}
	}

	/**
	 * Elimina un documento por ID
	 * @param id ID del documento
	 * @param session Sesión de transacción opcional
	 * @returns Documento eliminado o null
	 */
	async delete(id: string | Types.ObjectId, session?: any): Promise<T | null> {
		try {
			const options = {session};
			return await this.entityModel.findByIdAndDelete(id, options).exec();
		} catch (error) {
			this.logger.error(`Error deleting ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error deleting ${this.modelName}`, error);
		}
	}

	/**
	 * Elimina varios documentos que coinciden con un filtro
	 * @param filter Filtro para seleccionar documentos
	 * @param session Sesión de transacción opcional
	 * @returns Resultado de la operación
	 */
	async deleteMany(filter: FilterQuery<T>, session?: any): Promise<{deletedCount: number}> {
		try {
			const options = session ? {session} : {};
			const result = await this.entityModel.deleteMany(filter, options).exec();
			return {deletedCount: result.deletedCount};
		} catch (error) {
			this.logger.error(`Error deleting many ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error deleting many ${this.modelName}`, error);
		}
	}

	/**
	 * Cuenta documentos que coinciden con un filtro
	 * @param filter Filtro para seleccionar documentos
	 * @returns Número de documentos
	 */
	async count(filter: FilterQuery<T> = {}): Promise<number> {
		try {
			return await this.entityModel.countDocuments(filter).exec();
		} catch (error) {
			this.logger.error(`Error counting ${this.modelName}: ${error.message}`, error.stack);
			throw new BusinessException(`Error counting ${this.modelName}`, error);
		}
	}

	/**
	 * Verifica si existe un documento que coincide con un filtro
	 * @param filter Filtro para seleccionar documentos
	 * @returns true si existe, false en caso contrario
	 */
	async exists(filter: FilterQuery<T>): Promise<boolean> {
		try {
			return !!(await this.entityModel.exists(filter));
		} catch (error) {
			this.logger.error(`Error checking if ${this.modelName} exists: ${error.message}`, error.stack);
			throw new BusinessException(`Error checking if ${this.modelName} exists`, error);
		}
	}
}
