import {z} from Zod;

export default (schema) => (req , res , next) => {
    try{
        schema.parse(req.body);
        next();
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            message : "Input validation failed.",
            error : err.errors,
            status : "error"
        });
    }
}