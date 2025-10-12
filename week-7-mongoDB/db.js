import mongoose, { model, mongo } from "mongoose";
import { string } from "zod";

const Schema = mongoose.Schema;
const ObjectID = mongoose.ObjectID;

const User = new Schema({
    name : String,
    email : { type : String , unique : true},
    password : String,
});

const ToDo = new Schema({
    userId : ObjectID,
    done : Boolean,
    description : string
});

const UserModel = mongoose.model('users' , User);
const ToDoModel = mongoose.model('todos' , ToDo);

module.exports = {
    UserModel,
    ToDoModel
}