import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';
import connectDB from './models/db.js';
// import auth from "./auth.js";
import jwt from 'jsonwebtoken';
// import validate from "./validationMiddleware.js";
// import { signupSchema , createTodoSchema , todoUpdateSchema } from './validationSchemas.js';

//import environment variables 
dotenv.config();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());


//connect to DB and then set up server
connectDB().then(() => {
    app.listen(PORT , () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.log("Failed to start server:", err);
});


