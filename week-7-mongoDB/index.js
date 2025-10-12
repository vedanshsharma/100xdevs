import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { mongo } from "mongoose";

//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//connect to app
mongoose.connect("");

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




