import mongoose, { model, mongo } from "mongoose";
import bcrypt from "bcrypt"; 
import dotenv from 'dotenv';
import { string } from "zod";

//import environment variables 
dotenv.config();
const saltRound = process.env.BCRYPT_SALT_ROUNDS;

const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const User = new Schema({
    name : String,
    email : { type : String , unique : true},
    password : String,
});

User.pre('save' , async function(next) {
    const user = this; // 'this' refers to the Mongoose document being saved

    //only has if the password has been modified
    if(!user.isModified('password')){
        return next();
    }

    try {
        // 1. generate hash
        const hash = await bcrypt.hash(user.password , saltRound);

        //2. replace the plain text password with the hash password
        user.password = hash;

        //3. continue the save process
        next();
    } catch (err) {
        next(err); /// pass the error to the next mongoose
    }
})

User.method.comparePassword = async function(password){
    // Uses bcrypt to compare the plaintext candidatePassword with the stored hash
    // 'this.password' is the hashed password from the database
    // 'passassword' is the plaintext password from the login form
    return bcrypt.compare(password , this.password);
}

const ToDo = new Schema({
    userId : ObjectID,
    done : Boolean,
    description : String
});

export const UserModel = model('users' , User);
export const TodoModel = model('todos' , ToDo);

// module.exports = {
//     UserModel,
//     TodoModel
// }