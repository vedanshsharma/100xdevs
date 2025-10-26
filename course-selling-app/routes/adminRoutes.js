import express, {Router} from 'express';
import {createAccount , authenticateAndGenerateToken } 
    from '../services/userService.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import validate from '../middleware/validationMiddleware.js';
import { signupSchema } from '../schemas/validationSchema.js';
import { ca } from 'zod/v4/locales';
import { get } from 'mongoose';

const adminRouter = Router();

adminRouter.post('/signup' , validate(signupSchema) , async (req , res) =>{
    const { email , password , name } = req.body;
    try {
        await createAccount({
            email,
            password,
            name
        } , 'admin');
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

adminRouter.post('/signin' ,async (req , res) => {
    try{
        const { email , password } = req.body;
        const token = await authenticateAndGenerateToken(email , password , 'admin');
        res.status(200).json({token});
    }catch(error){
        if(error.message === 'UserNotFound' || error.message === 'InvalidPassword'){
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

adminRouter.use(auth);
adminRouter.use(adminAuth);

adminRouter.get('/profile' , async (req , res) => {
});

export default adminRouter;