import { Schema, Document } from 'mongoose';

export interface AddressDocument {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface PersonDocument extends Document {
  firstName: string;
  lastName: string;
  documentNumber?: string;
  documentType?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: AddressDocument;
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
  { _id: false }
);

export const PersonSchema = new Schema<PersonDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    documentNumber: {
      type: String,
      trim: true,
    },
    documentType: {
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
    mobilePhone: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    address: {
      type: AddressSchema,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimizar consultas
PersonSchema.index({ firstName: 1, lastName: 1 });
PersonSchema.index({ documentNumber: 1, documentType: 1 }, { unique: true, sparse: true });
PersonSchema.index({ email: 1 }, { sparse: true });
