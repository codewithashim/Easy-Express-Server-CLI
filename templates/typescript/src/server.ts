import cluster from 'cluster';
import os from 'os';
import { Server } from 'http';
import app from './app';
import { envConfig } from './shared/config/environment.config';
import { logger } from './shared/core/logger/logger';
import { connectDatabase, disconnectDatabase } from './shared/config/database.config';
 
const numCPUs = os.cpus().length;

async function gracefulShutdown(server: Server) {
    logger.info('🛑 SIGTERM or SIGINT received. Shutting down gracefully...');
    try {
        await new Promise<void>((resolve) => {
            server.close(() => resolve());
        });
        await disconnectDatabase();
        logger.info('👋 Server closed and database disconnected');
        process.exit(0);
    } catch (error) {
        logger.error('💥 Error during graceful shutdown:', error);
        process.exit(1);
    }
}

async function startServer(): Promise<Server> {
    try {
        await connectDatabase();
        const server = app.listen(envConfig.port, () => {
            logger.info(`🚀 Application listening on port ${envConfig.port}`);
        });

        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            switch (error.code) {
                case 'EACCES':
                    logger.error(`🔒 Port ${envConfig.port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error(`🚫 Port ${envConfig.port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        return server;
    } catch (err) {
        logger.error('💥 Failed to start the server:', err);
        throw err;
    }
}

async function bootstrap() {
    let server: Server;

    try {
        server = await startServer();

        process.on('SIGTERM', () => gracefulShutdown(server));
        process.on('SIGINT', () => gracefulShutdown(server));

        process.on('uncaughtException', (error) => {
            logger.error('🔥 Uncaught Exception:', error);
            gracefulShutdown(server);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
        });

    } catch (err) {
        logger.error('💥 Failed to start the application:', err);
        process.exit(1);
    }
}

if (cluster.isMaster && envConfig.useCluster) {
    logger.info(`🧠 Master process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`🚨 Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    bootstrap().catch((err) => {
        logger.error('💥 Unexpected error during bootstrap:', err);
        process.exit(1);
    });
}