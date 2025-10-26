import { CourseModel } from '../models/Courses.js'

export async function getCourse(){
    const courses = await CourseModel.find();
    return courses;
}

export async function getCourses(creatorID){
    const courses =  await CourseModel.find({
        creatorID
    });
    if(courses.length === 0){
        throw new Error("No courses found");
    }
    return courses;
}

export async function createCourse( creatorID , title , description , price){
    return await CourseModel.create({
        title,
        description,
        price,
        creatorID    
    });
}

export async function updateCourse(creatorID , courseID , body) {
    const response = await CourseModel.findOneAndUpdate({
        _id : courseID,
        creatorID : creatorID
    },
    {
        $set : body
    },
    {
        new : true,
        runValidators : true
    })
    if(!response){
        throw new Error("Course not found or you do not have permission to update it");
    }
    return response;
}