import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import connectDB from './models/db.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
// import validate from "./validationMiddleware.js";
// import { signupSchema , createTodoSchema , todoUpdateSchema } from './validationSchemas.js';

//import environment variables 
dotenv.config();
const PORT = process.env.PORT;
//setting localPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());

app.use('/user' , userRouter);
app.use('/admin' , adminRouter);

//connect to DB and then set up server
connectDB().then(() => {
    app.listen(PORT , () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.log("Failed to start server:", err);
});


