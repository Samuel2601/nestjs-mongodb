import {Schema, Document, Types} from 'mongoose';
import {AddressDocument} from './person-schema';

export interface RepresentativeDocument {
	personId?: Types.ObjectId;
	position?: string;
}

export interface BusinessDocument extends Document {
	name: string;
	legalName?: string;
	taxId?: string;
	type?: string;
	industry?: string;
	employeeCount?: number;
	website?: string;
	email?: string;
	phone?: string;
	secondaryPhone?: string;
	address?: AddressDocument;
	billingAddress?: AddressDocument;
	legalRepresentative?: RepresentativeDocument;
	primaryContact?: RepresentativeDocument;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const AddressSchema = new Schema<AddressDocument>(
	{
		street: String,
		number: String,
		city: String,
		state: String,
		country: String,
		postalCode: String,
	},
	{_id: false},
);

const RepresentativeSchema = new Schema<RepresentativeDocument>(
	{
		personId: {
			type: Schema.Types.ObjectId,
			ref: 'Person',
		},
		position: String,
	},
	{_id: false},
);

export const BusinessSchema = new Schema<BusinessDocument>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		legalName: {
			type: String,
			trim: true,
		},
		taxId: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			trim: true,
		},
		industry: {
			type: String,
			trim: true,
		},
		employeeCount: {
			type: Number,
		},
		website: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		secondaryPhone: {
			type: String,
			trim: true,
		},
		address: {
			type: AddressSchema,
		},
		billingAddress: {
			type: AddressSchema,
		},
		legalRepresentative: {
			type: RepresentativeSchema,
		},
		primaryContact: {
			type: RepresentativeSchema,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Índices para optimizar consultas
BusinessSchema.index({name: 1});
BusinessSchema.index({legalName: 1});
BusinessSchema.index({taxId: 1}, {unique: true, sparse: true});
BusinessSchema.index({industry: 1});
BusinessSchema.index({isActive: 1});
BusinessSchema.index({'legalRepresentative.personId': 1});
BusinessSchema.index({'primaryContact.personId': 1});
