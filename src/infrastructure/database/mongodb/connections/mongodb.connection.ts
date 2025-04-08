// infrastructure/database/mongodb/connections/mongodb.connection.ts

import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoDBConnection {
	constructor(private configService: ConfigService) {}

	async createConnection(): Promise<mongoose.Connection> {
		try {
			const mongoUri = this.configService.get<string>('MONGODB_URI');
			const mongoUser = this.configService.get<string>('MONGODB_USER');
			const mongoPassword = this.configService.get<string>('MONGODB_PASSWORD');
			const mongoDb = this.configService.get<string>('MONGODB_DB');
			const connection = await mongoose.createConnection(mongoUri, {
				user: mongoUser,
				pass: mongoPassword,
				dbName: mongoDb,
			});

			console.log('MongoDB connection established successfully');
			return connection;
		} catch (error) {
			console.error('Error connecting to MongoDB', error);
			throw error;
		}
	}
}
