import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value || defaultValue!;
};

export const envConfig = {
    appName: getEnv('APP_NAME', 'Easy Express'),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    port: parseInt(getEnv('PORT', '8000')),
    useTypeORM: getEnv('USE_TYPEORM', 'false') === 'true',
    useCluster: getEnv('USE_CLUSTER') === 'true',

    // Database
    database: {
        host: getEnv('DB_HOST', 'localhost'),
        port: parseInt(getEnv('DB_PORT', '27017')),
        name: getEnv('DB_NAME', 'easy-express'),
        user: getEnv('DB_USER', ''),
        password: getEnv('DB_PASSWORD', ''),
        uri: getEnv('DB_URI', 'mongodb://localhost:27017/easy-express'),
        dbClient: getEnv('DB_CLIENT', 'mongodb'),
        options: {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        },
    },

    // JWT
    jwt: {
        secret: getEnv('JWT_SECRET', 'secret'),
        expiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
        cookieExpiresIn: parseInt(getEnv('JWT_COOKIE_EXPIRES_IN', '7')),
        cookieName: getEnv('JWT_COOKIE_NAME', 'jwt'),
        cookieSecure: getEnv('JWT_COOKIE_SECURE', 'false') === 'true',
        cookieHttpOnly: getEnv('JWT_COOKIE_HTTP_ONLY', 'true') === 'true',
        cookieSameSite: getEnv('JWT_COOKIE_SAME_SITE', 'strict'),
        bcryptSalt: parseInt(getEnv('JWT_BYCRYPT_SALT', '14')),
    },

    // Mail
    mail: {
        host: getEnv('MAIL_HOST', 'smtp.gmail.com'),
        port: parseInt(getEnv('MAIL_PORT', '2525')),
        user: getEnv('MAIL_USER', ''),
        password: getEnv('MAIL_PASSWORD', ''),
    },

    // Cloudinary
    cloudinary: {
        cloudName: getEnv('CLOUDINARY_CLOUD_NAME', ''),
        apiKey: getEnv('CLOUDINARY_API_KEY', ''),
        apiSecret: getEnv('CLOUDINARY_API_SECRET', ''),
    },

    // Google
    google: {
        clientId: getEnv('GOOGLE_CLIENT_ID', ''),
        clientSecret: getEnv('GOOGLE_CLIENT_SECRET', ''),
    },

    // AWS S3
    aws: {
        accessKeyId: getEnv('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', ''),
        region: getEnv('AWS_REGION', ''),
        bucketName: getEnv('AWS_BUCKET_NAME', ''),
    },

    // Redis
    redis: {
        host: getEnv('REDIS_HOST', 'localhost'),
        port: parseInt(getEnv('REDIS_PORT', '6379')),
        password: getEnv('REDIS_PASSWORD', ''),
        uri: getEnv('REDIS_URI', 'redis://localhost:6379'),
    },

    // Logger
    logger: {
        label: getEnv('LOGGER_LABEL', 'Easy Express Server'),
        logDir: getEnv('LOG_DIR', 'logs'),
        logFilePrefix: getEnv('LOG_FILE_PREFIX', 'Easy-Express'),
        maxSize: getEnv('LOG_MAX_SIZE', '20m'),
        maxFiles: getEnv('LOG_MAX_FILES', '14d'),
        exceptionFileName: getEnv('EXCEPTION_LOG_FILE_NAME', 'exceptions'),
        rejectionFileName: getEnv('REJECTION_LOG_FILE_NAME', 'rejections'),
    },
};
