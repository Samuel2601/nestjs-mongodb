import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {BaseRepository} from '../base/base-repository';
import {PermissionDocument} from 'src/infrastructure/database/mongodb/schemas/administration/permission-schema';
import {PermissionRepository} from 'src/domain/repositories/administration/permission-repository';
import {Permission} from 'src/domain/entities/administration/permission-entity';

@Injectable()
export class PermissionRepositoryImpl extends BaseRepository<PermissionDocument> implements PermissionRepository {
	constructor(@InjectModel('Permission') private permissionModel: Model<PermissionDocument>) {
		super(permissionModel, 'Permission');
	}

	/**
	 * Mapea un documento MongoDB a una entidad de dominio
	 */
	private mapToEntity(document: PermissionDocument | null): Permission | null {
		if (!document) return null;

		return {
			id: document._id.toString(),
			key: document.key,
			name: document.name,
			description: document.description,
			group: document.group,
			isSystem: document.isSystem,
			createdAt: document.createdAt,
			updatedAt: document.updatedAt,
		};
	}

	/**
	 * Mapea múltiples documentos a entidades de dominio
	 */
	private mapToEntities(documents: PermissionDocument[]): Permission[] {
		return documents.map((doc) => this.mapToEntity(doc)!);
	}

	async findByKey(key: string): Promise<Permission | null> {
		const permission = await this.permissionModel.findOne({key}).exec();
		return this.mapToEntity(permission);
	}

	async keyExists(key: string): Promise<boolean> {
		return await this.exists({key});
	}

	async findByGroup(group: string): Promise<Permission[]> {
		const permissions = await this.permissionModel.find({group}).exec();
		return this.mapToEntities(permissions);
	}

	async getAllGroups(): Promise<string[]> {
		const groups = await this.permissionModel.distinct('group').exec();
		return groups.filter((group) => group !== null && group !== undefined);
	}

	async findSystemPermissions(): Promise<Permission[]> {
		const permissions = await this.permissionModel.find({isSystem: true}).exec();
		return this.mapToEntities(permissions);
	}

	async canBeModified(permissionId: string | Types.ObjectId): Promise<boolean> {
		const permission = await this.findById(permissionId);
		return !!permission && !permission.isSystem;
	}

	async findByIds(ids: (string | Types.ObjectId)[]): Promise<Permission[]> {
		const objectIds = ids.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

		const permissions = await this.permissionModel
			.find({
				_id: {$in: objectIds},
			})
			.exec();

		return this.mapToEntities(permissions);
	}

	/*// Implementaciones de los métodos CRUD del repositorio base
  
  async create(permissionData: Partial<Permission>, session?: any): Promise<Permission> {
    const createdPermission = await super.create(permissionData, session);
    return this.mapToEntity(createdPermission)!;
  }

  async findById(id: string | Types.ObjectId): Promise<Permission | null> {
    const permission = await super.findById(id);
    return this.mapToEntity(permission);
  }

  async find(filter: any = {}): Promise<Permission[]> {
    const permissions = await super.find(filter);
    return this.mapToEntities(permissions);
  }

  async update(id: string | Types.ObjectId, permissionData: Partial<Permission>, session?: any): Promise<Permission | null> {
    const updatedPermission = await super.update(id, permissionData, session);
    return this.mapToEntity(updatedPermission);
  }

  async delete(id: string | Types.ObjectId, session?: any): Promise<Permission | null> {
    const deletedPermission = await super.delete(id, session);
    return this.mapToEntity(deletedPermission);
  }

  async findPaginated(
    filter: any = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: Permission[]; total: number; page: number; limit: number; totalPages: number }> {
    const result = await super.findPaginated(filter, page, limit);
    
    return {
      ...result,
      data: this.mapToEntities(result.data),
    };
  }*/
}
