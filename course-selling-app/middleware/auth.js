import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//import environment variables 
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(req , res , next){
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({
            message : "Token missing"
        });
    }
    try {
        const response = jwt.verify(token , JWT_SECRET);
        req.id = response.id;
        req.role = response.role;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); 
        res.status(401).send({
        message : "Invalid Token"
        });
    }
}