import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';
import { UserModel , TodoModel } from "./db.js";
import auth from "./auth.js";
import jwt from 'jsonwebtoken';
import validate from "./validationMiddleware.js";
import { signupSchema , createTodoSchema , todoUpdateSchema } from './validationSchemas.js';

//import environment variables 
dotenv.config();
const connection_string = process.env.DB_CONNECTION_STRING;
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;
//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

