import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {BaseRepository} from '../base/base-repository';
import {BusinessDocument} from 'src/infrastructure/database/mongodb/schemas/general/business-schema';
import {BusinessRepository} from 'src/domain/repositories/general/business-repository';
import {Business} from 'src/domain/entities/general/business-entity';

@Injectable()
export class BusinessRepositoryImpl extends BaseRepository<BusinessDocument> implements BusinessRepository {
	constructor(@InjectModel('Business') private businessModel: Model<BusinessDocument>) {
		super(businessModel, 'Business');
	}

	/**
	 * Mapea un documento MongoDB a una entidad de dominio
	 */
	private mapToEntity(document: BusinessDocument | null): Business | null {
		if (!document) return null;

		return {
			id: document._id.toString(),
			name: document.name,
			legalName: document.legalName,
			taxId: document.taxId,
			type: document.type,
			industry: document.industry,
			employeeCount: document.employeeCount,
			website: document.website,
			email: document.email,
			phone: document.phone,
			secondaryPhone: document.secondaryPhone,
			address: document.address,
			billingAddress: document.billingAddress,
			legalRepresentative: document.legalRepresentative
				? {
						personId: document.legalRepresentative.personId?.toString(),
						position: document.legalRepresentative.position,
					}
				: undefined,
			primaryContact: document.primaryContact
				? {
						personId: document.primaryContact.personId?.toString(),
						position: document.primaryContact.position,
					}
				: undefined,
			isActive: document.isActive,
			createdAt: document.createdAt,
			updatedAt: document.updatedAt,
		};
	}

	/**
	 * Mapea múltiples documentos a entidades de dominio
	 */
	private mapToEntities(documents: BusinessDocument[]): Business[] {
		return documents.map((doc) => this.mapToEntity(doc)!);
	}

	async findByName(name: string): Promise<Business[]> {
		const businesses = await this.businessModel
			.find({
				name: new RegExp(name, 'i'),
			})
			.exec();

		return this.mapToEntities(businesses);
	}

	async findByTaxId(taxId: string): Promise<Business | null> {
		const business = await this.businessModel
			.findOne({
				taxId,
			})
			.exec();

		return this.mapToEntity(business);
	}

	async findByIndustry(industry: string): Promise<Business[]> {
		const businesses = await this.businessModel
			.find({
				industry: new RegExp(industry, 'i'),
			})
			.exec();

		return this.mapToEntities(businesses);
	}

	async findByType(type: string): Promise<Business[]> {
		const businesses = await this.businessModel
			.find({
				type: new RegExp(type, 'i'),
			})
			.exec();

		return this.mapToEntities(businesses);
	}

	async findByContactPerson(personId: string | Types.ObjectId): Promise<Business[]> {
		const objectId = typeof personId === 'string' ? new Types.ObjectId(personId) : personId;

		const businesses = await this.businessModel
			.find({
				$or: [{'legalRepresentative.personId': objectId}, {'primaryContact.personId': objectId}],
			})
			.exec();

		return this.mapToEntities(businesses);
	}

	async nameExists(name: string): Promise<boolean> {
		return await this.exists({name});
	}

	async taxIdExists(taxId: string): Promise<boolean> {
		return await this.exists({taxId});
	}

	async setActiveStatus(businessId: string | Types.ObjectId, isActive: boolean): Promise<Business | null> {
		const business = await this.update(businessId, {isActive});
		return this.mapToEntity(business);
	}

	/*// Implementaciones de los métodos CRUD del repositorio base
  
  async create(businessData: Partial<Business>, session?: any): Promise<Business> {
    const createdBusiness = await super.create(businessData, session);
    return this.mapToEntity(createdBusiness)!;
  }

  async findById(id: string | Types.ObjectId): Promise<Business | null> {
    const business = await super.findById(id);
    return this.mapToEntity(business);
  }

  async find(filter: any = {}): Promise<Business[]> {
    const businesses = await super.find(filter);
    return this.mapToEntities(businesses);
  }

  async update(id: string | Types.ObjectId, businessData: Partial<Business>, session?: any): Promise<Business | null> {
    const updatedBusiness = await super.update(id, businessData, session);
    return this.mapToEntity(updatedBusiness);
  }

  async delete(id: string | Types.ObjectId, session?: any): Promise<Business | null> {
    const deletedBusiness = await super.delete(id, session);
    return this.mapToEntity(deletedBusiness);
  }

  async findPaginated(
    filter: any = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: Business[]; total: number; page: number; limit: number; totalPages: number }> {
    const result = await super.findPaginated(filter, page, limit);
    
    return {
      ...result,
      data: this.mapToEntities(result.data),
    };
  }*/
}
