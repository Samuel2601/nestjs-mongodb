/**
 * Excepción personalizada para errores de negocio
 * Utilizada para representar errores específicos del dominio
 */
export class BusinessException extends Error {
	/**
	 * Errores adicionales o información detallada
	 */
	errors?: any;

	/**
	 * Constructor
	 * @param message Mensaje de error
	 * @param errors Errores adicionales o información detallada (opcional)
	 */
	constructor(message: string, errors?: any) {
		super(message);
		this.name = 'BusinessException';
		this.errors = errors;

		// Esto es necesario para que instanceof funcione correctamente en TypeScript
		Object.setPrototypeOf(this, BusinessException.prototype);
	}
}
