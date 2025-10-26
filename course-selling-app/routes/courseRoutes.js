import express, {Router} from 'express';
import { createCourse , getCourses, updateCourse } from '../services/courseService.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import validate from '../middleware/validationMiddleware.js';
import { courseCreateSchema, courseUpdateSchema } from '../schemas/validationSchema.js';

const courseRouter = Router();

courseRouter.use(auth);

courseRouter.get('/my-courses' , async (req , res) => {
    const userID = req.id;
    try{

    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
courseRouter.use(adminAuth);

courseRouter.get('/created' , async (req , res) => {
    const userID = req.id;
    try{
        const courses = await getCourses(userID);
        res.status(200).json(courses);
    }
    catch(error){
        if(error.message === 'No courses found'){
            return res.status(404).json({
                message : "No courses found"
            });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

courseRouter.post('/' ,validate(courseCreateSchema)  , async (req , res) => {
    const { title , description , price } = req.body;
    try{
        const newCourse = await createCourse(req.id , title , description , price);
        res.status(201).json(newCourse);
    }
    catch(error){
        console.error("Course creation failed:", error);
        res.status(500).json({
            message : "Course creation failed"
        });
    }
});

courseRouter.patch('/:courseID' , 
    validate(courseUpdateSchema) , async(req , res) =>{
        const creatorID = req.id;
        const courseID = req.params.courseID;
        const updates = req.body;
        try{
            const course = await updateCourse(creatorID , courseID , updates);
            res.status(200).json(course);
        }
        catch(error){
            if(error.message === 'Course not found or you do not have permission to update it'){
                res.status(404).json({
                    message : "Course not found or you do not have permission to update it"
                });
            }
            else{
                console.log(error);
                res.status(500).json({
                    message : "Internal server error"
                }); 
            }
        }
 });
