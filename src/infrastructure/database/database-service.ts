import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // Comprueba la conexión
      if (this.connection.readyState === 1) {
        this.logger.log('MongoDB connection is established');
        
        // Ejecuta migraciones si están habilitadas
        if (this.configService.get<boolean>('RUN_MIGRATIONS')) {
          await this.runMigrations();
        }
        
        // Ejecuta seeds si estamos en desarrollo o testing
        const nodeEnv = this.configService.get<string>('NODE_ENV');
        if (['development', 'test'].includes(nodeEnv)) {
          await this.runSeeds();
        }
      } else {
        this.logger.error('Failed to connect to MongoDB');
      }
    } catch (error) {
      this.logger.error(`Error initializing database: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async runMigrations() {
    this.logger.log('Running database migrations...');
    try {
      // Aquí implementarías la lógica para ejecutar migraciones
      // Ejemplo: await this.migrationsService.runMigrations();
      this.logger.log('Migrations completed successfully');
    } catch (error) {
      this.logger.error(`Error running migrations: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async runSeeds() {
    this.logger.log('Running database seeds...');
    try {
      // Aquí implementarías la lógica para ejecutar seeds
      // Ejemplo: await this.seedService.seedDatabase();
      this.logger.log('Seeds completed successfully');
    } catch (error) {
      this.logger.error(`Error running seeds: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Método para verificar el estado de la conexión a la base de datos
   * Útil para health checks
   */
  async checkHealth() {
    try {
      // Ejecutar una consulta simple para verificar la conexión
      await this.connection.db.admin().ping();
      return {
        status: 'ok',
        message: 'Database connection is healthy',
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Database connection error: ${error.message}`,
      };
    }
  }

  /**
   * Obtiene estadísticas de la base de datos
   */
  async getDatabaseStats() {
    try {
      const stats = await this.connection.db.stats();
      return {
        dbName: stats.db,
        collections: stats.collections,
        documents: stats.objects,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
      };
    } catch (error) {
      this.logger.error(`Error getting database stats: ${error.message}`, error.stack);
      throw error;
    }
  }
}
