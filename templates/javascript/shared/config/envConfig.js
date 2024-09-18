import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};


const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
for (const envVar of requiredEnvVars) {
    if (!envConfig[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export default envConfig;