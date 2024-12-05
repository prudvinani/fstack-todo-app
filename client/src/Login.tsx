import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ModeToggle } from "./components/mode-toggle";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/signin`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        // localStorage.setItem("userId", data.userId);
        toast.success("Signed in", { duration: 2400 });
        navigate("/home");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("sign in error", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-between">
          <CardTitle className="text-2xl">Login</CardTitle>
          <ModeToggle/>
          </div>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">

                
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-3" type="submit" >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
