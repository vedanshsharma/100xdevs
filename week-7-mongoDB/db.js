import mongoose, { model, mongo } from "mongoose";
import { string } from "zod";

const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;


const User = new Schema({
    name : String,
    email : { type : String , unique : true},
    password : String,
});

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