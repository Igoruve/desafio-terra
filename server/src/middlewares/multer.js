import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

//Codigo necesario para el path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir carpeta uploads absoluta (dos niveles arriba y luego /uploads)
const uploadDir = path.join(__dirname, "../../uploads");

// Crear carpeta uploads si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        let name = path.basename(file.originalname, extension);

        name = name.toLowerCase().replace(/\s+/g, "-");

         const randomSuffix = `${String.fromCharCode(97 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`;

        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const second = String(now.getSeconds()).padStart(2, "0");

        const date = `${year}${month}${day}${hour}${minute}${second}`;
        const fileName = `${name}-${date}-${randomSuffix}${extension}`;

        cb(null, fileName);
    }
});

//Filtro de archivos (solo imagenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
