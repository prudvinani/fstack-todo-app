import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { ModeToggle } from "./components/mode-toggle";

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true); 
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/signup`,
        { email, password }
      );

      const data = response.data;
      if (data?.success) {
        toast.success("Successfully signed up!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      toast.error("Something went wrong during signup:", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
    <Card className="w-[350px] ">
    <CardHeader>
     <Toaster richColors/>
     <div className="flex justify-between">
     <CardTitle className="text-2xl">Signup</CardTitle>
     <ModeToggle/>
     </div>
      <CardDescription>Enter your credentials to access your account</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Create your Password" value={password} onChange={(e)=>setPassword(e.target.value)}  />
          </div>
       
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex flex-col" >
    <Button className="w-full" type="submit" disabled={loading} onClick={handleSignup}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>      <p className="mt-2 text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
    </CardFooter>
  </Card>
</div>
  );
}
