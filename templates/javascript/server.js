import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/routes.js';
import envConfig from "./shared/config/envConfig.js"
import connectToDB from './shared/config/dbConfig.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use('/api/v1', router);

const startServer = async () => {
  try {
    await connectToDB();
    app.listen(envConfig.PORT, () => console.log(`🚀 Server running on port ${envConfig.PORT} `));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();