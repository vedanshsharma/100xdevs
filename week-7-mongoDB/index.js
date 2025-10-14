import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';
import { UserModel } from "./db.js";
import auth from "./auth.js";
import jwt from 'jsonwebtoken';

//import environment variables 
dotenv.config();
const connection_string = process.env.DB_CONNECTION_STRING;
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;
//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//connect to DB
mongoose.connect(connection_string);

//require app
const app = express();
app.use(express.json());

app.post("/signup" , async function(req , res){
    const { email , password , name } = req.body; 
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Missing required fields: email, password, and name are required."
        });
    }
    try{
        await UserModel.create({
        email ,
        password ,
        name 
        });
        res.status(201).json({
            message : "You are signed up"
        });
    }
    catch(err){
        if(err.code == 11000){
            return res.status(409).json({
                message: "This email is already registered."
            });
        }
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post("/signin" ,async function(req , res){
    try{
        const { email , password } = req.body;
        const response = await UserModel.findOne({
            email ,
            password 
        });
        if(response){
            // console.log(response);
            const token = jwt.sign({
                id : response._id.toString()  
            } , jwt_secret);
            res.status(200).json({
                token : token
            });
        }
        else{
            res.status(403).json({
                message : "Incorrect creds"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.use(auth);

app.post("/todo" , async function name(req , res) {
    
});

app.get("/todos" , async function name(req , res) {
    
});

app.listen(port);




