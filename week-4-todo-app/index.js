import express from 'express';
import fs from 'node:fs/promises';
import Joi from 'joi';

const app = express();
// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

let requestNumber = 0;
let numberOfRequestForUser = {};

setInterval(function(){
    numberOfRequestForUser = {};
},10000);

app.use(function(req,res,next){
    requestNumber += 1;
    console.log(requestNumber);
    console.log("Method is " + req.method);
    console.log("URL is " + req.url);
    console.log(new Date());
    next();
});

app.use(function(req,res,next){
    console.log(next);
    const userID = req.headers["user_id"];
    console.log(numberOfRequestForUser);
    if(numberOfRequestForUser[userID]){
        numberOfRequestForUser[userID] += 1;
    }
    else{
        numberOfRequestForUser[userID] = 1;
    }
    if(numberOfRequestForUser[userID] > 5){
        return res.status(429).send('Too Many Requests');
    }
    console.log(numberOfRequestForUser);
    next();
});

app.use(function(err , req , res , next){
    console.log(err.stack);
    return res.stack(400).send("Something broke.");
});

const TodoScehma = Joi.object({
    ID : Joi.number(),
    task: Joi.string(),
    status: Joi.string().valid('pending', 'completed')
});

//route header
app.get('/'  ,async function(req , res){
    // console.log(req);
    try{
        const data = await fs.readFile('todos.json' , 'utf-8' );
        let body = JSON.parse(data);
        // console.log(body);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
    }
    catch(err){
        console.log(err);
        res.status(500).send('internal server error');
    }
});

app.post('/'  , async function(req , res){
    // console.log(req.body);
    try{
        const data = await fs.readFile('todos.json' , 'utf-8' );
        let body = JSON.parse(data);
        body.push(req.body);
        const jsonString = JSON.stringify(body, null, 2);
        await fs.writeFile('todos.json' ,  jsonString);
        res.status(201).send('Created');
    }
    catch(err){
        console.log(err);
        res.status(500).send('internal server error');
    }
});
//dynamic route
app.delete('/:id' , async function(req , res){
    const id = req.params.id;
    try{
        const data = await fs.readFile('todos.json' , 'utf-8' );
        let body = JSON.parse(data);
        const result = body.filter((todo) => todo.ID != id);
        if(result.length == body.length){
            return res.status(404).send('Item not found');
        }
        const jsonString = JSON.stringify(result, null, 2);
        await fs.writeFile('todos.json' ,  jsonString);
        res.status(204).end();
    }
    catch(err){
        console.log(err);
        if (err.code === 'ENOENT') {
            return res.status(404).send('Resource not found.');
        }
        res.status(500).send('internal server error');
    }
});

app.patch('/:id' , async function(req,res){
    const id = parseInt(req.params.id);
    const {error} = TodoScehma.validate(req.body);
    if(error){
        // console.log(error);
        return res.status(400).json({ error: error.details[0].message});
    }
    try{
        const data = await fs.readFile('todos.json' , 'utf-8' );
        let body = JSON.parse(data);
        const updateIndex = body.findIndex((todo) => todo.ID == id);
        
        if(updateIndex === -1){
            return res.status(404).send('Item not found');
        }
        body[updateIndex] = req.body;
        const jsonString = JSON.stringify(body, null, 2);
        await fs.writeFile('todos.json' ,  jsonString);
        res.status(200).json(body[updateIndex]);
    }
    catch(err){
        console.log(err);
        if (err.code === 'ENOENT') {
            return res.status(404).send('Resource not found.');
        }
        res.status(500).send('internal server error');
    }
} );

// app.post('/add')

app.listen(3000);