import jwt from 'jsonwebtoken';

//import environment variables 
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

export function auth(req , res , next){
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).send({
            message : "Token missing"
        });
    }
    try{
        const response = jwt.verify(token , jwt_secret);
        req.id = response.id;
        next();
    }
    catch(err){
        console.error("JWT Verification Error:", err.message); 
        res.status(401).send({
        message : "Invalid Token"
        });
    }
}