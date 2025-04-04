import { Types } from 'mongoose';

/**
 * Entidad de dominio para Empresa
 * Representa a una organización o empresa
 */
export class Business {
  id?: string | Types.ObjectId;
  
  /**
   * Nombre comercial de la empresa
   */
  name: string;
  
  /**
   * Razón social
   */
  legalName?: string;
  
  /**
   * Número de identificación fiscal
   */
  taxId?: string;
  
  /**
   * Tipo de empresa
   */
  type?: string;
  
  /**
   * Industria o sector
   */
  industry?: string;
  
  /**
   * Número de empleados
   */
  employeeCount?: number;
  
  /**
   * Sitio web
   */
  website?: string;
  
  /**
   * Correo electrónico principal
   */
  email?: string;
  
  /**
   * Teléfono principal
   */
  phone?: string;
  
  /**
   * Teléfono secundario
   */
  secondaryPhone?: string;
  
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
   * Dirección de facturación (si es diferente a la principal)
   */
  billingAddress?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  /**
   * Representante legal
   */
  legalRepresentative?: {
    personId?: string | Types.ObjectId;
    position?: string;
  };
  
  /**
   * Contacto principal
   */
  primaryContact?: {
    personId?: string | Types.ObjectId;
    position?: string;
  };
  
  /**
   * Si la empresa está activa
   */
  isActive?: boolean;
  
  /**
   * Fecha de creación
   */
  createdAt?: Date;
  
  /**
   * Fecha de última actualización
   */
  updatedAt?: Date;
}
