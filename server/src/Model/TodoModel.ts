import mongoose,{Schema} from "mongoose";

const TodoSchema = new Schema({
  user:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
},
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const TodoModel = mongoose.model("Todo", TodoSchema);
