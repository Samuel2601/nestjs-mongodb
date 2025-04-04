import {Types} from 'mongoose';
import {Person} from 'src/domain/entities/general/person-entity';

/**
 * Interfaz del repositorio de Persona
 * Define los métodos específicos para operaciones con personas
 */
export abstract class PersonRepository {
	/**
	 * Encuentra personas por su nombre y apellido
	 * @param firstName Nombre
	 * @param lastName Apellido
	 * @returns Lista de personas encontradas
	 */
	abstract findByName(firstName: string, lastName: string): Promise<Person[]>;

	/**
	 * Encuentra una persona por su documento de identidad
	 * @param documentNumber Número de documento
	 * @param documentType Tipo de documento (opcional)
	 * @returns Persona encontrada o null
	 */
	abstract findByDocument(documentNumber: string, documentType?: string): Promise<Person | null>;

	/**
	 * Encuentra una persona por su correo electrónico
	 * @param email Correo electrónico
	 * @returns Persona encontrada o null
	 */
	abstract findByEmail(email: string): Promise<Person | null>;

	/**
	 * Verifica si existe una persona con el documento especificado
	 * @param documentNumber Número de documento
	 * @param documentType Tipo de documento (opcional)
	 * @returns true si existe, false en caso contrario
	 */
	abstract documentExists(documentNumber: string, documentType?: string): Promise<boolean>;

	/**
	 * Verifica si existe una persona con el correo electrónico especificado
	 * @param email Correo electrónico
	 * @returns true si existe, false en caso contrario
	 */
	abstract emailExists(email: string): Promise<boolean>;

	/**
	 * Métodos básicos CRUD
	 */
	abstract create(person: Partial<Person>, session?: any): Promise<Person>;
	abstract findById(id: string | Types.ObjectId): Promise<Person | null>;
	abstract find(filter?: any): Promise<Person[]>;
	abstract update(id: string | Types.ObjectId, person: Partial<Person>, session?: any): Promise<Person | null>;
	abstract delete(id: string | Types.ObjectId, session?: any): Promise<Person | null>;
	abstract findPaginated(filter: any, page: number, limit: number): Promise<{data: Person[]; total: number; page: number; limit: number; totalPages: number}>;
}
