import {z} from 'zod';

export default (schema) => (req , res , next) => {
    try{
        schema.parse(req.body);
        next();
    }
    catch(err){
        console.log(err.message);
        res.status(400).json({
            message : "Input validation failed.",
            error : JSON.parse(err.message),
            status : "error"
        });
    }
}