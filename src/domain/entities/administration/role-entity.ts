import { Types } from 'mongoose';

/**
 * Entidad de dominio para Rol
 */
export class Role {
  id?: string | Types.ObjectId;
  
  /**
   * Nombre del rol
   */
  name: string;
  
  /**
   * Descripción del rol
   */
  description?: string;
  
  /**
   * Lista de IDs de permisos asociados al rol
   */
  permissionIds: (string | Types.ObjectId)[];
  
  /**
   * Si el rol es un rol de sistema (no puede ser modificado ni eliminado)
   */
  isSystem?: boolean;
  
  /**
   * Fecha de creación
   */
  createdAt?: Date;
  
  /**
   * Fecha de última actualización
   */
  updatedAt?: Date;
}
