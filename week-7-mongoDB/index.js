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

//connect to DB
mongoose.connect(connection_string);

//require app
const app = express();
app.use(express.json());

app.post("/signup" , validate(signupSchema) , async function(req , res){
    const { email , password , name } = req.body; 
    // if (!email || !password || !name) {
    //     return res.status(400).json({
    //         message: "Missing required fields: email, password, and name are required."
    //     });
    // }
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
        const user = await UserModel.findOne({
            email 
        });
        if(!user){
            return res.status(401).json({ message : "Invalid email or password"});
        }
        const isMatch = await user.comparePassword(password);
        
        if(isMatch){
            // console.log(response);
            const token = jwt.sign({
                id : user._id.toString()  
            } , jwt_secret , {
                expiresIn : "1h"
            });
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

app.post("/todo" , validate(createTodoSchema) ,async function name(req , res) {
    const { description , done } = req.body;
    const userId = req.id;
    const now = new Date();
    const createdOn = now.toLocaleString();
    try{
        await TodoModel.create({
            userId ,
            description ,
            done,
            createdOn
        });
        res.status(201).json({ message : "To do created."})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get("/todos" , async function name(req , res) {
    const userId = req.id;
    try{
        const response = await TodoModel.find({
            userId :userId
        }).populate('userId').exec();
        if(response.length === 0){
           return res.status(404).json({ message: "No todos found for this user." });
        }
        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/todo/:id' , async function(req , res){
    const userId = req.id; 
    const todoId = req.params.id; 
    try{
        const response = await TodoModel.findOneAndDelete({
            _id : todoId,
            userId : userId
        });
        if(!response){
            return res.status(404).json({
                message : "Todo item not found or you do not have permission to delete it."
            });
        }
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.patch('/todo/:id' , validate(todoUpdateSchema) , async function(req , res){
    const userId = req.id;
    const todoId = req.params.id;
    const updates = req.body;
    
    if(Object.keys(updates).length === 0){
        return res.status(400).json({ message : "Update body cannot be empty." });
    }
    try {
        const response = await TodoModel.findOneAndUpdate({
            _id : todoId,
            userId : userId
        },
        {
            $set : updates
        },
        {
            new : true,
            runValidators : true
        });

        if(!response){
            return res.status(404).json({
                message : "Todo item not found or you do not have permission to delete it."
            });
        }
        res.status(200).json(response);
    } catch (err) {
        console.log(err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: 'Internal Server Error' });c
    }
});

app.listen(port);




