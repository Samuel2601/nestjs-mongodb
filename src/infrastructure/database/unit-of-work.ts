import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class UnitOfWork {
  private readonly logger = new Logger(UnitOfWork.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  /**
   * Ejecuta una función dentro de una transacción
   * @param work Función a ejecutar dentro de la transacción
   * @returns Resultado de la función
   */
  async withTransaction<T>(work: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();
    
    try {
      const result = await work(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      this.logger.error(`Transaction error: ${error.message}`, error.stack);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Verifica si hay una transacción activa en la sesión
   * @param session Sesión a verificar
   * @returns true si hay una transacción activa, false en caso contrario
   */
  isTransactionActive(session: mongoose.ClientSession): boolean {
    return session && session.inTransaction();
  }

  /**
   * Ejecuta una función con sesión si se proporciona, o crea una nueva transacción si no se proporciona
   * @param sessionOrWork Sesión existente o función a ejecutar
   * @param work Función a ejecutar (si se proporcionó una sesión)
   * @returns Resultado de la función
   */
  async withSessionOrTransaction<T>(
    sessionOrWork: mongoose.ClientSession | ((session: mongoose.ClientSession) => Promise<T>),
    work?: (session: mongoose.ClientSession) => Promise<T>,
  ): Promise<T> {
    // Si solo se proporciona la función, crear una nueva transacción
    if (typeof sessionOrWork === 'function' && !work) {
      return this.withTransaction(sessionOrWork);
    }

    // Si se proporciona sesión y función, usar la sesión existente
    if (typeof sessionOrWork !== 'function' && work) {
      const session = sessionOrWork as mongoose.ClientSession;
      return work(session);
    }

    throw new Error('Invalid parameters for withSessionOrTransaction');
  }
}
