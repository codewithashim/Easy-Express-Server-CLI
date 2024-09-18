import { v2 as cloudinary } from 'cloudinary';
import envConfig from './envConfig.js';

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET
  });
};

export default cloudinaryConfig;