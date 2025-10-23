import express, {Router} from 'express';
import { UserModel } from '../models/Users.js';
import { PurchaseModel } from '../models/Purchases.js';
import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.post('/signup' ,async (req , res) =>{
    const { email , password , name } = req.body;
    if(!email || !password || !name){
        return res.status(400).json({
            message: "Missing required fields: email, password, and name are required."
        });
    }
    try {
        await UserModel.create({
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

userRouter.post('/signin' ,async (req , res) => {
    try{
        const { email , password } = req.body;
        const user = await UserModel.findOne({
            email 
        });
        if(!user){
            return res.status(401).json({
                "message" : "Invalid email or password"
            })
        }
        const isMatch = await user.comparePassword(password);
        if(isMatch){
            const token = jwt.sign({
                id : user._id.toString(),
                role : user.role
            } , jwt_secret , {
                expiresIn : "1h"
            });
            res.status(200).json({
                token : token
            });
        }
        else{
            res.status(403).json({
                message : "Invalid email or password"
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.use(auth);

userRouter.get('/profile' , async (req , res) => {
});

userRouter.get('/courses' , async (req , res) => {
    userID = req.id;
    try{
        const purchases = await PurchaseModel.find({
            userID : userID,
            expireAt : {
                $gte : new Date()
            }
        }).populate('courseID').exec();

        res.status(200).json(purchases);
    }
    catch(error){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default userRouter;