import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import * as bcrypt from 'bcrypt';

import {User} from '../../../../domain/entities/administration/user.entity';
import {UserRepository} from '../../../../domain/repositories/administration/user.repository';
import {UserDocument} from '../../../database/mongodb/schemas/administration/user.schema';
import {BaseRepository} from '../base/base-repository';

@Injectable()
export class UserRepositoryImpl extends BaseRepository<UserDocument> implements UserRepository {
	constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
		super(userModel, 'User');
	}

	/**
	 * Mapea un documento MongoDB a una entidad de dominio
	 */
	private mapToEntity(document: UserDocument | null): User | null {
		if (!document) return null;

		return {
			id: document._id.toString(),
			email: document.email,
			username: document.username,
			personId: document.personId,
			roleIds: document.roleIds.map((id) => id.toString()),
			isActive: document.isActive,
			isEmailVerified: document.isEmailVerified,
			emailVerificationToken: document.emailVerificationToken,
			passwordResetToken: document.passwordResetToken,
			passwordResetExpires: document.passwordResetExpires,
			lastLogin: document.lastLogin,
			authMethod: document.authMethod,
			externalAuth: document.externalAuth,
			createdAt: document.createdAt,
			updatedAt: document.updatedAt,
		};
	}

	/**
	 * Mapea múltiples documentos a entidades de dominio
	 */
	private mapToEntities(documents: UserDocument[]): User[] {
		return documents.map((doc) => this.mapToEntity(doc)!);
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.userModel.findOne({email: email.toLowerCase()}).exec();
		return this.mapToEntity(user);
	}

	async findByUsername(username: string): Promise<User | null> {
		const user = await this.userModel.findOne({username}).exec();
		return this.mapToEntity(user);
	}

	async emailExists(email: string): Promise<boolean> {
		return await this.exists({email: email.toLowerCase()});
	}

	async usernameExists(username: string): Promise<boolean> {
		return await this.exists({username});
	}

	async findByRoles(roleIds: (string | Types.ObjectId)[]): Promise<User[]> {
		const objectIdRoleIds = roleIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

		const users = await this.userModel
			.find({
				roleIds: {$in: objectIdRoleIds},
			})
			.exec();

		return this.mapToEntities(users);
	}

	async updateLastLogin(userId: string | Types.ObjectId, date: Date): Promise<User | null> {
		const user = await this.update(userId, {lastLogin: date});
		return this.mapToEntity(user);
	}

	async updateRoles(userId: string | Types.ObjectId, roleIds: (string | Types.ObjectId)[]): Promise<User | null> {
		const objectIdRoleIds = roleIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

		const user = await this.update(userId, {roleIds: objectIdRoleIds});
		return this.mapToEntity(user);
	}

	async setActiveStatus(userId: string | Types.ObjectId, isActive: boolean): Promise<User | null> {
		const user = await this.update(userId, {isActive});
		return this.mapToEntity(user);
	}

	async setEmailVerified(userId: string | Types.ObjectId, isVerified: boolean): Promise<User | null> {
		const updateData: any = {
			isEmailVerified: isVerified,
		};

		// Si está verificado, eliminar el token de verificación
		if (isVerified) {
			updateData.emailVerificationToken = null;
		}

		const user = await this.update(userId, updateData);
		return this.mapToEntity(user);
	}

	async savePasswordResetToken(email: string, token: string, expires: Date): Promise<User | null> {
		const user = await this.userModel
			.findOneAndUpdate(
				{email: email.toLowerCase()},
				{
					passwordResetToken: token,
					passwordResetExpires: expires,
				},
				{new: true},
			)
			.exec();

		return this.mapToEntity(user);
	}

	async findByResetToken(token: string): Promise<User | null> {
		const user = await this.userModel
			.findOne({
				passwordResetToken: token,
				passwordResetExpires: {$gt: new Date()},
			})
			.exec();

		return this.mapToEntity(user);
	}

	async updatePassword(userId: string | Types.ObjectId, newPassword: string): Promise<User | null> {
		// Hashear la nueva contraseña
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Actualizar la contraseña y eliminar tokens de restablecimiento
		const user = await this.update(userId, {
			password: hashedPassword,
			passwordResetToken: null,
			passwordResetExpires: null,
		});

		return this.mapToEntity(user);
	}

	/*// Implementaciones de los métodos CRUD del repositorio base

	async create(userData: Partial<User>, session?: any): Promise<User> {
		const createdUser = await super.create(userData, session);
		return this.mapToEntity(createdUser)!;
	}

	async findById(id: string | Types.ObjectId): Promise<User | null> {
		const user = await super.findById(id);
		return this.mapToEntity(user);
	}

	async find(filter: any = {}): Promise<User[]> {
		const users = await super.find(filter);
		return this.mapToEntities(users);
	}

	async update(id: string | Types.ObjectId, userData: Partial<User>, session?: any): Promise<User | null> {
		const updatedUser = await super.update(id, userData, session);
		return this.mapToEntity(updatedUser);
	}

	async delete(id: string | Types.ObjectId, session?: any): Promise<User | null> {
		const deletedUser = await super.delete(id, session);
		return this.mapToEntity(deletedUser);
	}

	async findPaginated(filter: any = {}, page = 1, limit = 10): Promise<{data: User[]; total: number; page: number; limit: number; totalPages: number}> {
		const result = await super.findPaginated(filter, page, limit);

		return {
			...result,
			data: this.mapToEntities(result.data),
		};
	}*/
}
