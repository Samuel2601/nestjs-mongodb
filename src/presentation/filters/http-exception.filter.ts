import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger} from '@nestjs/common';
import {Request, Response} from 'express';
import * as mongoose from 'mongoose';
import {BusinessException} from 'src/common/exceptions/business-exception';

// Primero, necesitamos definir ValidationException
export class ValidationException extends Error {
	constructor(
		public readonly message: string,
		public readonly errors: any = null,
	) {
		super(message);
		this.name = 'ValidationException';
	}
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status: number;
		let message: string;
		let errors: any = null;

		// Manejo de excepciones específicas
		if (exception instanceof HttpException) {
			// Excepciones de NestJS
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				message = (exceptionResponse as any).message || exception.message;
				errors = (exceptionResponse as any).errors || null;
			} else {
				message = (exceptionResponse as string) || exception.message;
			}
		} else if (exception instanceof BusinessException) {
			// Excepciones de negocio personalizadas
			status = HttpStatus.BAD_REQUEST;
			message = exception.message;
			errors = exception.errors;
		} else if (exception instanceof ValidationException) {
			// Excepciones de validación personalizadas
			status = HttpStatus.UNPROCESSABLE_ENTITY;
			message = exception.message;
			errors = exception.errors;
		} else if (exception instanceof mongoose.Error.ValidationError) {
			// Errores de validación de Mongoose
			status = HttpStatus.BAD_REQUEST;
			message = 'Error de validación de datos';
			errors = Object.values(exception.errors).map((err) => ({
				field: err.path,
				message: err.message,
			}));
		} else if (exception instanceof mongoose.Error.CastError) {
			// Errores de conversión de tipos de Mongoose
			status = HttpStatus.BAD_REQUEST;
			message = `Formato inválido para el campo ${exception.path}`;
		} else if (exception instanceof Error) {
			// Errores genéricos de JavaScript
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			message = 'Error interno del servidor';

			// En desarrollo, podemos mostrar el mensaje real
			if (process.env.NODE_ENV !== 'production') {
				message = exception.message;
			}

			// Registrar el error completo para depuración
			this.logger.error(`Error no manejado: ${exception.message}`, exception.stack, `${request.method} ${request.url}`);
		} else {
			// Cualquier otro tipo de error
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			message = 'Error interno del servidor';

			this.logger.error(`Error desconocido:`, exception, `${request.method} ${request.url}`);
		}

		// Estructura de respuesta estandarizada para errores
		response.status(status).json({
			statusCode: status,
			message,
			errors,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}
