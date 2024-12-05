import React, { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { ModeToggle } from "./components/mode-toggle";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const Home: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  const fetchTodos = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/todos`, { headers });
      setTodos(response.data);
      toast.success("Todos loaded successfully!");
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      console.warn("Authorization headers are missing. Aborting delete operation.");
      return;
    }
  
    try {
      await axios.delete(`${import.meta.env.VITE_BACKENDURL}/todo/${id}`, { headers });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id)); // Remove the deleted todo from the list
      toast.success("Todo successfully removed.");
    } catch (error: any) {
      console.error("Unable to delete todo:", error);
      toast.error(error.response?.data?.message || "Unable to delete the todo.");
    }
  };
  

  useEffect(() => {
    fetchTodos();
  }, []);

  const postTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.info("Please provide a title and description.");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/todo`,
        { title, description },
        { headers }
      );

      const newTodo = response.data.todo; 
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTitle("");
      setDescription("");
      toast.success("Todo added successfully!");
    } catch (error: any) {
      console.error("Error adding todo:", error);
      toast.error(error.response?.data?.message || "Failed to add todo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="flex justify-between px-10 py-6 sticky shadow-lg">
        <p className="text-2xl font-semibold">Simple Todo</p>
        <div className="flex items-center">
          <ModeToggle />
          <button
            onClick={handleLogout}
            className="font-bold text-2xl cursor-pointer ml-5"
            title="Logout"
          >
            <LuLogOut />
          </button>
        </div>
      </header>

      <main className="mt-">
        <section className="px-10 pt-4 md:px-72 ">
          <p className="text-xl font-semibold">Add Todo</p>
          <form className="flex mt-3" onSubmit={postTodo}>

            
            <Input
              placeholder="Enter your title"
              className="mr-2 hidden md:block w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            
            <Input
              placeholder="Enter your description"
              className="mr-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Todo"}
            </Button>
          </form>
        </section>

        {/* List Todos */}
        <section className="px-10 md:px-72 mt-5">
    {loading ? (
      <p>Loading todos...</p>
    ) : todos.length > 0 ? (
      todos.map((todo) => (
        <div
          key={todo._id} 
          className="mb-3 p-4 rounded shadow-sm flex justify-between"
        >
          <div>
            <h3 className="font-bold">{todo.title}</h3>
            <p>{todo.description}</p>
          </div>
          <Button
            onClick={() => handleDeleteTodo(todo._id)} 
            className="bg-red-500 hover:bg-red-400"
          >
            Delete
          </Button>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No todos available. Add some to get started!</p>
    )}
  </section>
      </main>
    </div>
  );
};

export default Home;
