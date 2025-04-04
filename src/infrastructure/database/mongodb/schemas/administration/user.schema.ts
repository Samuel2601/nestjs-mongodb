import {Schema, Document, Types} from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends Document {
	email: string;
	username: string;
	password: string;
	personId?: Types.ObjectId;
	roleIds: Types.ObjectId[];
	isActive: boolean;
	isEmailVerified: boolean;
	emailVerificationToken?: string;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	lastLogin?: Date;
	authMethod?: 'local' | 'google' | 'facebook' | 'apple' | 'microsoft';
	externalAuth?: {
		provider: string;
		providerId: string;
	};
	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: function () {
				return this.authMethod === 'local' || !this.authMethod;
			},
		},
		personId: {
			type: Schema.Types.ObjectId,
			ref: 'Person',
		},
		roleIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Role',
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: String,
		passwordResetToken: String,
		passwordResetExpires: Date,
		lastLogin: Date,
		authMethod: {
			type: String,
			enum: ['local', 'google', 'facebook', 'apple', 'microsoft'],
			default: 'local',
		},
		externalAuth: {
			provider: String,
			providerId: String,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Índices para optimizar consultas
UserSchema.index({email: 1});
UserSchema.index({username: 1});
UserSchema.index({personId: 1});
UserSchema.index({roleIds: 1});
UserSchema.index({isActive: 1});
UserSchema.index({'externalAuth.provider': 1, 'externalAuth.providerId': 1});

// Método pre-save para hashear la contraseña
UserSchema.pre('save', async function (next) {
	// Solo hashear la contraseña si ha sido modificada o es nueva
	if (!this.isModified('password')) {
		return next();
	}

	try {
		// Generar un salt y hashear la contraseña
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw error;
	}
};

// Excluir password y tokens cuando convertimos a JSON
UserSchema.set('toJSON', {
	transform: (doc, ret) => {
		delete ret.password;
		delete ret.emailVerificationToken;
		delete ret.passwordResetToken;
		return ret;
	},
});
