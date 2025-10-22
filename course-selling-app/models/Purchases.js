import mongoose , {model} from "mongoose";

const Schema = mongoose.Schema;

const purchasesSchema = new Schema({
    userID : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    courseID : {
        type : Schema.Types.ObjectId,
        ref : 'courses',
        required : true
    },
    enrolledDate: { type: Date, default: Date.now },
    expireAt : {
        type : Date,
        default : function(){
            const date = new Date();
            date.setMonth(date.getMonth() + 6 );
            return date;
        }
    }
});

export const PurchaseModel = model('purchases' , purchasesSchema);
