import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { createConnection, Connection } from 'typeorm';
import { envConfig } from './environment.config';
import { errorLogger, logger } from '../core/logger/logger';

type SupportedDatabaseType = 'mongodb' | 'mysql' | 'postgres' | 'sqlite';

interface DatabaseConfig {
    type: SupportedDatabaseType;
    url: string;
    options?: any;
}

let mongoConnection: typeof mongoose | null = null;
let sqlConnection: Sequelize | null = null;
let ormConnection: Connection | null = null;

const databaseConfig: DatabaseConfig = {
    url: envConfig.database.uri,
    options: envConfig.database.options || {},
    type: envConfig.database.dbClient as SupportedDatabaseType,
};

function validateDatabaseConfig(): void {
    if (!databaseConfig.url) {
        throw new Error('❌ Database URL is not provided');
    }
    if (!databaseConfig.type) {
        throw new Error('❌ Database type is not specified');
    }
    if (!['mongodb', 'mysql', 'postgres', 'sqlite'].includes(databaseConfig.type)) {
        throw new Error(`❌ Unsupported database type: ${databaseConfig.type}`);
    }
}

async function connectMongoDB(): Promise<void> {
    try {
        if (mongoConnection) {
            logger.info('📊 MongoDB connection already exists');
            return;
        }
        mongoConnection = await mongoose.connect(databaseConfig.url, {
            ...databaseConfig.options,
        });
        logger.info('🎉 MongoDB connected successfully');
    } catch (error) {
        errorLogger.error('💥 MongoDB connection failed', error);
        throw error;
    }
}

async function connectSQL(): Promise<void> {
    try {
        if (sqlConnection) {
            logger.info(`📊 ${databaseConfig.type} connection already exists`);
            return;
        }
        sqlConnection = new Sequelize(databaseConfig.url, {
            ...databaseConfig.options,
            dialect: databaseConfig.type,
        });
        await sqlConnection.authenticate();
        logger.info(`🎉 ${databaseConfig.type} connected successfully`);
    } catch (error) {
        errorLogger.error(`💥 ${databaseConfig.type} connection failed`, error);
        throw error;
    }
}

async function connectTypeORM(): Promise<void> {
    try {
        if (ormConnection && ormConnection.isConnected) {
            logger.info(`📊 ${databaseConfig.type} connection already exists (TypeORM)`);
            return;
        }
        ormConnection = await createConnection({
            type: databaseConfig.type,
            url: databaseConfig.url,
            ...databaseConfig.options,
        });
        logger.info(`🎉 ${databaseConfig.type} connected successfully using TypeORM`);
    } catch (error) {
        errorLogger.error(`💥 ${databaseConfig.type} connection failed (TypeORM)`, error);
        throw error;
    }
}

async function disconnectDatabase(): Promise<void> {
    try {
        if (mongoConnection) {
            await mongoose.disconnect();
            mongoConnection = null;
            logger.info('👋 MongoDB disconnected');
        }
        if (sqlConnection) {
            await sqlConnection.close();
            sqlConnection = null;
            logger.info(`👋 ${databaseConfig.type} disconnected`);
        }
        if (ormConnection && ormConnection.isConnected) {
            await ormConnection.close();
            ormConnection = null;
            logger.info(`👋 ${databaseConfig.type} disconnected (TypeORM)`);
        }
    } catch (error) {
        errorLogger.error('💥 Error while disconnecting database', error);
        throw error;
    }
}

async function connectDatabase(): Promise<void> {
    try {
        validateDatabaseConfig();

        switch (databaseConfig.type) {
            case 'mongodb':
                await connectMongoDB();
                break;
            case 'mysql':
            case 'postgres':
            case 'sqlite':
                if (envConfig.useTypeORM) {
                    await connectTypeORM();
                } else {
                    await connectSQL();
                }
                break;
            default:
                throw new Error(`❌ Unsupported database type: ${databaseConfig.type}`);
        }
    } catch (error) {
        errorLogger.error('💥 Database connection failed', error);
        throw error;
    }
}

export { connectDatabase, disconnectDatabase };