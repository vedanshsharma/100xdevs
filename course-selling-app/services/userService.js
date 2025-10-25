import jwt from 'jsonwebtoken';
import { AdminModel , UserModel } from '../models/Users.js';


const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Creates a new user account using the appropriate Mongoose model.
 * @param {object} data - Account data (email, password, name).
 * @param {string} role - ('Admin' or 'User').
 */
export async function createAccount(body , role) {
    let model;
    if(role === 'admin'){
        model = AdminModel;
    }
    else if(role === 'user'){
        model = UserModel;
    }
    else{
        throw new Error('Invalid role');
    }
    return await model.create({
        email : body.email,
        password : body.password,
        name : body.name
    });    
}

/**
 * Authenticates a user and generates a JWT token upon success.
 * @param {string} email - User's email.
 * @param {string} password - User's plaintext password.
 * @param {string} role - ('Admin' or 'User').
 * @returns {Promise<object>} Object containing the JWT token.
 */
export async function authenticateAndGenerateToken(email, password, role) {
    let model;
    if(role === 'admin'){
        model = AdminModel;
    }
    else if(role === 'user'){
        model = UserModel;
    }
    else{
        throw new Error('Invalid role');
    }

    const user = await model.findOne({
        email
    });
    if(!user){
        throw new Error('UserNotFound');
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new Error('InvalidPassword');
    }
    const token = jwt.sign({
        id : user._id.toString(),
        role : user.role
    } , JWT_SECRET , {
        expiresIn : "1h"    
    });
    return token;
}

