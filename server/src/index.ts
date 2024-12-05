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
    user?: string;
  }
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



mongoose.connect(process.env.MONGOURL as string).then(()=>console.log("mongodb is connected"))
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
        if(!email || !password){
             res.status(400).json({
                success:false,
                message:"Email and Password are required"
            })
        }
        const EmailExistied=await UserModel.findOne({email})
        if(EmailExistied){
            res.status(409).json({message:"User is already existed in the database"})
        }
        const hashpassword=await bcrypt.hash(password,10)
         await UserModel.create({email,password:hashpassword})
         
         res.status(201).json({
            success: true,
            message: "Successfully signed up!",
          });

    }catch(er){
console.log("You can't create the user Signup ")
    }
})

app.post("/signin", async (req: Request, res: Response):Promise<any> => {
    try {
      // Assuming you're using a proper validation for login:
      const { email, password } = req.body;
      
      // Validate email and password
      if (!email || !password) {
         res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Email does not exist in the database" });
      }
  
      // Compare hashed password with input password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWTPASSWORD as string, {
        expiresIn: "1h",
      });
  
      // Respond with token and user ID
      res.status(200).json({
        success: true,
        token: token,
        userId: user._id,
      });
    } catch (err) {
      console.log("Signin error:", err);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  


app.post('/todo', AuthMiddleware, async (req:AuthenticatedRequest, res:Response):Promise<any> => {
  const { title, description } = req.body;
  const userId = req.userId; 
  try {
    if (!userId || !title || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newTodo = new TodoModel({
      user: userId,
      title,
      description,
    });

    await newTodo.save();

  

    return res.status(201).json({ message: 'Todo added successfully.', todo: newTodo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/todos',AuthMiddleware, async (req:AuthenticatedRequest, res:Response):Promise<any>=> {
    const userId = req.userId; 
    try {
        const todos = await TodoModel.find({user:userId});

        if (!todos.length) {
            return res.status(404).json({ message: 'No todos found for this user.' });
        }

        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


app.delete("/todo/:id",AuthMiddleware,async(req:AuthenticatedRequest,res:Response):Promise<any>=>{
    const {id}=req.params;
    try{
        await TodoModel.findByIdAndDelete(id)
        res.status(200).json({message:"Todo is deleted from the database"})
    }catch(er){
console.log(er)
    }
})

app.put("/todo/:id",AuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
    const {id}=req.params;
    const {title,description}=req.body
    try{
        const todoupdate=await TodoModel.findByIdAndUpdate(id,{title,description})
        res.status(201).json({message:"Todo is updated in the database",todoupdate})

    }catch(er){
        console.log(er)
    }
})



app.listen(3000,()=>{
    console.log(`http://localhost:3000`)
})
