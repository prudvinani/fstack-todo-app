import dotenv from "dotenv"
dotenv.config()
import express,{Request,Response} from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import {z} from "zod"
import { UserModel } from "./Model/UserModel"
import { AuthMiddleware } from "./MiddleWare"
import { TodoModel } from "./Model/TodoModel"

const app=express()
interface AuthenticatedRequest extends Request {
    userId?: string;
  }
app.use(express.json())
app.use(cors({
    credentials:true
}))

mongoose.connect('mongodb://localhost:27017/myproduction').then(()=>console.log("mongodb is connected"))
const SignupValidation=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})


interface AuthenticatedRequest extends Request {
    userId?: string;
  }
app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"Welcome to the API todo"})
})



app.post("/signup",async(req:Request,res:Response)=>{
    try{
        const {email,password}=SignupValidation.parse(req.body);
        const EmailExistied=await UserModel.findOne({email})
        if(EmailExistied){
            res.status(409).json({message:"User is already existed in the database"})
        }
        const hashpassword=await bcrypt.hash(password,10)
         await UserModel.create({email,password:hashpassword})
         res.status(201).json({message:"User is Created in the database"})

    }catch(er){
console.log("You can't create the user Signup ")
    }
})

app.post("/signin",async(req:Request,res:Response)=>{
    try{
        const {email,password}=SignupValidation.parse(req.body);
        const EmailExistied=await UserModel.findOne({email})
        if(!EmailExistied){
            res.status(409).json({message:"email is does not existed in the database"})
        }
        const hashCompare =await bcrypt.compare(password,EmailExistied?.password as string)
        if(!hashCompare){
            res.status(409).json({message:"invalid credentails of the password"})
        }

         const tokengenerate=jwt.sign({id:EmailExistied?._id as string},"ARJUNCHAY")
         res.status(200).json({token:tokengenerate})

    }catch(er){
console.log("You can't create the user Signup ")
    }
})



app.post("/todo", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
       res.status(400).json({ message: "Please enter the data" });
       return;
    }

  
    const newTodo = await TodoModel.create({
        //@ts-ignore
      userId: req.userId,
      title,
      description,
    });

    res.status(201).json({ message: "Todo created successfully", todo: newTodo });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

  
  


app.get('/todo',AuthMiddleware,async(req:Request,res:Response)=>{
    try{

    }catch(er){
console.log("went wrong in the posting")
    }
})
app.listen(6000,()=>{
    console.log("the server is started")
})