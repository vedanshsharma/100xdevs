import express, {Router} from 'express';
import { AdminModel } from '../models/Users.js';
import auth from '../middleware/auth.js';

const adminRouter = Router();

adminRouter.post('/signup' ,async (req , res) =>{
    const { email , password , name } = req.body;
    if(!email || !password || !name){
        return res.status(400).json({
            message: "Missing required fields: email, password, and name are required."
        });
    }
    try {
        await AdminModel.create({
            email,
            password,
            name
        });
        res.status(201).json({
            message : "You are signed up"
        });
    } catch (error) {
        if(error.code == 11000){
            return res.status(409).json({
                message: "This email is already registered."
            });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default adminRouter;