import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';

//import environment variables 
dotenv.config();

//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//connect to app
mongoose.connect(process.env.DB_CONNECTION_STRING);

//require app
const app = express();
app.use(express.json());

app.post("/signup" , function(req , res){

});

app.post("/signin" , function(req , res){

});

app.post("/todo" , async function name(req , res) {
    
});

app.get("/todos" , async function name(req , res) {
    
});

app.listen(process.env.PORT);




