import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/mongo.js';
import session from 'express-session';
import cors from 'cors';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectMongoDB();

// Crear servidor Express
const app = express();
const PORT = process.env.APP_PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const options = {
    origin: CLIENT_URL,
    credentials: true
};

// Configurar middleware
app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('src/public'));


// Configurar sesión
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true para HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
    }
}));

// Configurar rutas
app.use('/', router);

// Iniciar servidor
app.listen(3000, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});