import {Types} from 'mongoose';
import {Business} from 'src/domain/entities/general/business-entity';

/**
 * Interfaz del repositorio de Empresa
 * Define los métodos específicos para operaciones con empresas
 */
export abstract class BusinessRepository {
	/**
	 * Encuentra empresas por nombre (parcial)
	 * @param name Nombre de empresa (parcial)
	 * @returns Lista de empresas encontradas
	 */
	abstract findByName(name: string): Promise<Business[]>;

	/**
	 * Encuentra una empresa por su identificación fiscal
	 * @param taxId Número de identificación fiscal
	 * @returns Empresa encontrada o null
	 */
	abstract findByTaxId(taxId: string): Promise<Business | null>;

	/**
	 * Encuentra empresas por industria
	 * @param industry Industria o sector
	 * @returns Lista de empresas encontradas
	 */
	abstract findByIndustry(industry: string): Promise<Business[]>;

	/**
	 * Encuentra empresas por tipo
	 * @param type Tipo de empresa
	 * @returns Lista de empresas encontradas
	 */
	abstract findByType(type: string): Promise<Business[]>;

	/**
	 * Encuentra empresas donde una persona es contacto principal o representante legal
	 * @param personId ID de la persona
	 * @returns Lista de empresas encontradas
	 */
	abstract findByContactPerson(personId: string | Types.ObjectId): Promise<Business[]>;

	/**
	 * Verifica si existe una empresa con el nombre especificado
	 * @param name Nombre de empresa
	 * @returns true si existe, false en caso contrario
	 */
	abstract nameExists(name: string): Promise<boolean>;

	/**
	 * Verifica si existe una empresa con la identificación fiscal especificada
	 * @param taxId Número de identificación fiscal
	 * @returns true si existe, false en caso contrario
	 */
	abstract taxIdExists(taxId: string): Promise<boolean>;

	/**
	 * Activa o desactiva una empresa
	 * @param businessId ID de la empresa
	 * @param isActive Estado de activación
	 * @returns Empresa actualizada
	 */
	abstract setActiveStatus(businessId: string | Types.ObjectId, isActive: boolean): Promise<Business | null>;

	/**
	 * Métodos básicos CRUD
	 */
	abstract create(business: Partial<Business>, session?: any): Promise<Business>;
	abstract findById(id: string | Types.ObjectId): Promise<Business | null>;
	abstract find(filter?: any): Promise<Business[]>;
	abstract update(id: string | Types.ObjectId, business: Partial<Business>, session?: any): Promise<Business | null>;
	abstract delete(id: string | Types.ObjectId, session?: any): Promise<Business | null>;
	abstract findPaginated(filter: any, page: number, limit: number): Promise<{data: Business[]; total: number; page: number; limit: number; totalPages: number}>;
}
