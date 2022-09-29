import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import postRoutes from "./routes/posts.routes.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middlewares
app.use(morgan("dev"));
app.use(express.json()); //Preparando express para que entienda json
app.use(express.urlencoded({ extended: false }));

app.use(
    fileUpload({
        tempFileDir: path.join(__dirname, "/upload"),
        useTempFiles: true, //Para que no lo mantenga en memoria, y lo guarde en carpeta.
    })
);

console.log(__dirname)
app.use(express.static(path.join(__dirname, '../client/build')));

/* app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build/index.html'))
}) */

app.use("/images", express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api", postRoutes);

export { app };