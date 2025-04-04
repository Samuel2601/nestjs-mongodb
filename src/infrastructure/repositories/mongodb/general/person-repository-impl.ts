import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {BaseRepository} from '../base/base-repository';
import {PersonDocument} from 'src/infrastructure/database/mongodb/schemas/general/person-schema';
import {PersonRepository} from 'src/domain/repositories/general/person-repository';
import {Person} from 'src/domain/entities/general/person-entity';

@Injectable()
export class PersonRepositoryImpl extends BaseRepository<PersonDocument> implements PersonRepository {
	constructor(@InjectModel('Person') private personModel: Model<PersonDocument>) {
		super(personModel, 'Person');
	}

	/**
	 * Mapea un documento MongoDB a una entidad de dominio
	 */
	private mapToEntity(document: PersonDocument | null): Person | null {
		if (!document) return null;

		return {
			id: document._id.toString(),
			firstName: document.firstName,
			lastName: document.lastName,
			documentNumber: document.documentNumber,
			documentType: document.documentType,
			email: document.email,
			phone: document.phone,
			mobilePhone: document.mobilePhone,
			birthDate: document.birthDate,
			gender: document.gender,
			address: document.address,
			createdAt: document.createdAt,
			updatedAt: document.updatedAt,
		};
	}

	/**
	 * Mapea múltiples documentos a entidades de dominio
	 */
	private mapToEntities(documents: PersonDocument[]): Person[] {
		return documents.map((doc) => this.mapToEntity(doc)!);
	}

	async findByName(firstName: string, lastName: string): Promise<Person[]> {
		const regex = {
			firstName: new RegExp(firstName, 'i'),
			lastName: new RegExp(lastName, 'i'),
		};

		const persons = await this.personModel.find(regex).exec();
		return this.mapToEntities(persons);
	}

	async findByDocument(documentNumber: string, documentType?: string): Promise<Person | null> {
		const query: any = {documentNumber};
		if (documentType) {
			query.documentType = documentType;
		}

		const person = await this.personModel.findOne(query).exec();
		return this.mapToEntity(person);
	}

	async findByEmail(email: string): Promise<Person | null> {
		const person = await this.personModel
			.findOne({
				email: email.toLowerCase(),
			})
			.exec();

		return this.mapToEntity(person);
	}

	async documentExists(documentNumber: string, documentType?: string): Promise<boolean> {
		const query: any = {documentNumber};
		if (documentType) {
			query.documentType = documentType;
		}

		return await this.exists(query);
	}

	async emailExists(email: string): Promise<boolean> {
		return await this.exists({email: email.toLowerCase()});
	}

	/*// Implementaciones de los métodos CRUD del repositorio base
  
  async create(personData: Partial<Person>, session?: any): Promise<Person> {
    const createdPerson = await super.create(personData, session);
    return this.mapToEntity(createdPerson)!;
  }

  async findById(id: string | Types.ObjectId): Promise<Person | null> {
    const person = await super.findById(id);
    return this.mapToEntity(person);
  }

  async find(filter: any = {}): Promise<Person[]> {
    const persons = await super.find(filter);
    return this.mapToEntities(persons);
  }

  async update(id: string | Types.ObjectId, personData: Partial<Person>, session?: any): Promise<Person | null> {
    const updatedPerson = await super.update(id, personData, session);
    return this.mapToEntity(updatedPerson);
  }

  async delete(id: string | Types.ObjectId, session?: any): Promise<Person | null> {
    const deletedPerson = await super.delete(id, session);
    return this.mapToEntity(deletedPerson);
  }

  async findPaginated(
    filter: any = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: Person[]; total: number; page: number; limit: number; totalPages: number }> {
    const result = await super.findPaginated(filter, page, limit);
    
    return {
      ...result,
      data: this.mapToEntities(result.data),
    };
  }*/
}
