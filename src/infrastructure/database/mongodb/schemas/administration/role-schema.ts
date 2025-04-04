import { Schema, Document, Types } from 'mongoose';

export interface RoleDocument extends Document {
  name: string;
  description?: string;
  permissionIds: Types.ObjectId[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RoleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissionIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Permission',
    }],
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimizar consultas
RoleSchema.index({ name: 1 });
RoleSchema.index({ isSystem: 1 });
