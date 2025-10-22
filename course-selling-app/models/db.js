import mongoose from "mongoose";
import dotenv from 'dotenv';

//import environment variables 
dotenv.config();
const connection_string = process.env.DB_CONNECTION_STRING;

export default async function(){
    try{
        await mongoose.connect(connection_string);
        console.log("Connected to DB");
    }
    catch(err){
        console.log("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

