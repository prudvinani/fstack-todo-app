
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
import { Link } from "react-router-dom"
const Lockdata = () => {
  return (
  <div className="w-full h-screen">
    <p className="text-end p-10"><ModeToggle/></p>
      <div className="flex flex-col justify-center items-center w-full pt-36 ">
      <div className="flex items-center ">
      <p className="md:text-3xl font-semibold tracking-tight mr-2 text-xl ">Welcome to Simple Todo App.📝</p>
      {/* <p><ModeToggle/></p> */}
      </div>

        <div className="pt-5 flex ">
           <div className="mr-3 text-xl">
           <Link to={"/login"}><Button variant="outline">Login</Button></Link>
           </div>
            <Link to={'signup'}><Button variant="outline">Signup</Button></Link>

        </div>
    </div>
  </div>
  )
}

export default Lockdata