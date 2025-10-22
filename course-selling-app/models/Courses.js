import mongoose , {model} from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    creatorID : {
        type : Schema.Types.ObjectId,
        ref : 'admin',
        required : true
    }
});

export const CourseModel = model('courses' , courseSchema);