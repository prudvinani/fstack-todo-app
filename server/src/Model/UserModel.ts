import mongoose, { Schema, Document, mongo } from "mongoose"
interface UModel extends Document {
    email: string;
    password: string
}
const UserSchema = new Schema({
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    todos:[{
        type:mongoose.Types.ObjectId,
        ref:"Todo",
        required:true
    }]
})
export const UserModel=mongoose.model<UModel>("User",UserSchema)