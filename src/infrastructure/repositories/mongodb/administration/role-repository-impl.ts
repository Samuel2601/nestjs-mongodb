import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {BaseRepository} from '../base/base-repository';
import {RoleDocument} from 'src/infrastructure/database/mongodb/schemas/administration/role-schema';
import {RoleRepository} from 'src/domain/repositories/administration/role-repository';
import {Role} from 'src/domain/entities/administration/role-entity';

@Injectable()
export class RoleRepositoryImpl extends BaseRepository<RoleDocument> implements RoleRepository {
	constructor(@InjectModel('Role') private roleModel: Model<RoleDocument>) {
		super(roleModel, 'Role');
	}

	/**
	 * Mapea un documento MongoDB a una entidad de dominio
	 */
	private mapToEntity(document: RoleDocument | null): Role | null {
		if (!document) return null;

		return {
			id: document._id.toString(),
			name: document.name,
			description: document.description,
			permissionIds: document.permissionIds.map((id) => id.toString()),
			isSystem: document.isSystem,
			createdAt: document.createdAt,
			updatedAt: document.updatedAt,
		};
	}

	/**
	 * Mapea múltiples documentos a entidades de dominio
	 */
	private mapToEntities(documents: RoleDocument[]): Role[] {
		return documents.map((doc) => this.mapToEntity(doc)!);
	}

	async findByName(name: string): Promise<Role | null> {
		const role = await this.roleModel.findOne({name}).exec();
		return this.mapToEntity(role);
	}

	async nameExists(name: string): Promise<boolean> {
		return await this.exists({name});
	}

	async findByPermission(permissionId: string | Types.ObjectId): Promise<Role[]> {
		const objectId = typeof permissionId === 'string' ? new Types.ObjectId(permissionId) : permissionId;

		const roles = await this.roleModel
			.find({
				permissionIds: {$in: [objectId]},
			})
			.exec();

		return this.mapToEntities(roles);
	}

	async updatePermissions(roleId: string | Types.ObjectId, permissionIds: (string | Types.ObjectId)[], session?: any): Promise<Role | null> {
		const objectIdPermissionIds = permissionIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

		const role = await this.update(roleId, {permissionIds: objectIdPermissionIds}, session);
		return this.mapToEntity(role);
	}

	async findSystemRoles(): Promise<Role[]> {
		const roles = await this.roleModel.find({isSystem: true}).exec();
		return this.mapToEntities(roles);
	}

	async canBeModified(roleId: string | Types.ObjectId): Promise<boolean> {
		const role = await this.findById(roleId);
		return !!role && !role.isSystem;
	}

	/*// Implementaciones de los métodos CRUD del repositorio base
  
  async create(roleData: Partial<Role>, session?: any): Promise<Role> {
    const createdRole = await super.create(roleData, session);
    return this.mapToEntity(createdRole)!;
  }

  async findById(id: string | Types.ObjectId): Promise<Role | null> {
    const role = await super.findById(id);
    return this.mapToEntity(role);
  }

  async find(filter: any = {}): Promise<Role[]> {
    const roles = await super.find(filter);
    return this.mapToEntities(roles);
  }

  async update(id: string | Types.ObjectId, roleData: Partial<Role>, session?: any): Promise<Role | null> {
    const updatedRole = await super.update(id, roleData, session);
    return this.mapToEntity(updatedRole);
  }

  async delete(id: string | Types.ObjectId, session?: any): Promise<Role | null> {
    const deletedRole = await super.delete(id, session);
    return this.mapToEntity(deletedRole);
  }

  async findPaginated(
    filter: any = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: Role[]; total: number; page: number; limit: number; totalPages: number }> {
    const result = await super.findPaginated(filter, page, limit);
    
    return {
      ...result,
      data: this.mapToEntities(result.data),
    };
  }*/
}
