import { Types } from 'mongoose';

/**
 * Entidad de dominio para Permiso
 */
export class Permission {
  id?: string | Types.ObjectId;
  
  /**
   * Clave única del permiso
   */
  key: string;
  
  /**
   * Nombre del permiso
   */
  name: string;
  
  /**
   * Descripción del permiso
   */
  description?: string;
  
  /**
   * Grupo al que pertenece el permiso (para organizar permisos relacionados)
   */
  group?: string;
  
  /**
   * Si el permiso es un permiso de sistema (no puede ser modificado ni eliminado)
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
