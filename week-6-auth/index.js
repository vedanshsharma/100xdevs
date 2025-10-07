import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

let users = [];
const JWT_SECRET = 'ilovekanpur❤️'
function generateToken(){
    return crypto.randomBytes(32).toString('hex');
}

function auth(req,res,next){
    const token = req.headers.authorization;
    if(!token){
        res.status(401).send({
            message : "Token missing"
        });
        return;
    }
    try {
        let userDetails =  jwt.verify(token , JWT_SECRET);
        req.username = userDetails.username;
        next();
    } catch (error) {
        res.status(401).send({
            message : "Invalid Token"
        });
    }
}

app.use(express.json());
app.use(cors());

app.get("/" , (req,res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/signup' , (req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && 
        user.password == password)
    
    if(user){
        res.end({
            message : "Email already exists."
        });

    }

    users.push({
        'username' : username,
        'password' : password
    })
    res.send({
        "message" : "You have signed up."
    }).status(201);
});

app.post('/signin' , (req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && 
        user.password == password)
    
    if(user){
        const token = jwt.sign({
            username: user.username
        } , JWT_SECRET);
        //user.token = token;
        res.send({
            token
        });
        //console.log(users);
    }
    else{
        res.status(403).send({
            message : "Invalid username or password"
        })
    }
});



app.get('/me' , auth ,(req,res) => {
    const username = req.username;
    const user = users.find(user => user.username === username);
    if(user){
        res.send({
            username : user.username
        });
    }
    else{
        res.status(401).send({
            message : "Unathorized"
        });
    }
});

app.listen(3000);