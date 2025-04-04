import { Types } from 'mongoose';

/**
 * Entidad de dominio para Persona
 * Representa a una persona física con sus datos personales
 */
export class Person {
  id?: string | Types.ObjectId;
  
  /**
   * Nombres de la persona
   */
  firstName: string;
  
  /**
   * Apellidos de la persona
   */
  lastName: string;
  
  /**
   * Documento de identidad
   */
  documentNumber?: string;
  
  /**
   * Tipo de documento
   */
  documentType?: string;
  
  /**
   * Correo electrónico
   */
  email?: string;
  
  /**
   * Teléfono principal
   */
  phone?: string;
  
  /**
   * Teléfono secundario o celular
   */
  mobilePhone?: string;
  
  /**
   * Fecha de nacimiento
   */
  birthDate?: Date;
  
  /**
   * Género
   */
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  /**
   * Dirección física
   */
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  /**
   * Fecha de creación
   */
  createdAt?: Date;
  
  /**
   * Fecha de última actualización
   */
  updatedAt?: Date;
}
