/* import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER;
        const DB_PASSWORD = process.env.DB_PASSWORD;
        const DB_HOST = process.env.DB_HOST;
        const DB_PORT = process.env.DB_PORT;
        const DB_NAME = process.env.DB_NAME;

const connectMongoDB = async () => {
    try {
        /* const DB_USER = process.env.MONGO_USER;
        const DB_PASSWORD = process.env.MONGO_PASSWORD;
        const DB_HOST = process.env.MONGO_HOST;
        const DB_PORT = process.env.MONGO_PORT;
        const DB_NAME = process.env.MONGO_DATABASE; 
        
        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

connectMongoDB();

export default mongoose.connection; */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const connectMongoDB = async () => {
  try {
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

    await mongoose.connect(uri);

    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

export default mongoose.connection;
