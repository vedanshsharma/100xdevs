import mongoose , {model} from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

//import environment vairables 
dotenv.config();
const saltRound = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const Schema = mongoose.Schema;

const baseOptions = {
        timestamps : true,
        discriminatorKey : 'role',
        // collection : 'users',
        versionKey : false
    }

//Base User schema
const BaseUserSchema = new Schema({
    name : String ,
    email : { type : String , unique : true } ,
    password : String
} , baseOptions);

BaseUserSchema.pre('save' , async function (next) {
    const user = this; // 'this' refers to the Mongoose document being saved
    //only has if the password has been modified
    if(!user.isModified('password')){
        return next();
    }
    try {
        const hash = await bcrypt.hash(user.password , saltRound);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

BaseUserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password , this.password);
}

const BaseModel = mongoose.model('users' , BaseUserSchema);

//User Schema
export const UserModel = BaseModel.discriminator('user' , 
    new Schema({    
        permissionLevel : { type : Number , default : 1}
    })
);

// Admin Schema 
export const AdminModel = BaseModel.discriminator('admin' , 
    new Schema({    
        permissionLevel : { type : Number , default : 10}
    })
);





