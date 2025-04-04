import { Schema, Document } from 'mongoose';

export interface PermissionDocument extends Document {
  key: string;
  name: string;
  description?: string;
  group?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionSchema = new Schema<PermissionDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    group: {
      type: String,
      trim: true,
    },
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
PermissionSchema.index({ key: 1 });
PermissionSchema.index({ name: 1 });
PermissionSchema.index({ group: 1 });
PermissionSchema.index({ isSystem: 1 });
