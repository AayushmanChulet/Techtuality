import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config/config";
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import axios from "axios";
import LabelledInput from "@/components/ui/labelledInput";
import { cn } from "@/lib/utils";
import CircularProgress from '@mui/material/CircularProgress';

interface Todo {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewTodo {
  status: string;
  todo: Todo;
}

interface TodoResponse {
  status: string;
  todos: Todo[];
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function DashboardPage() {
  const [searchField, setSearchField] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [newTodoDescription, setNewTodoDescription] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {

    const token = localStorage.getItem("authorization");

    if (!token) {
      navigate("/signin");
    }

    setToken(token);

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<TodoResponse>(
          `${BACKEND_URL}/api/v1/tasks`,
          {
            headers: {
              authorization: token,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch todos");
        }

        const data = response.data.todos;
        setTodos(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token, navigate]);

  useEffect(() => {
    const filteredTodos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchField.toLowerCase())
    );
    setFilteredTodos(filteredTodos);
  }, [searchField, todos]);
  console.log(filteredTodos);

  const handleCreateTodo = async () => {
    try {

      const response = await axios.post<NewTodo>(
        `${BACKEND_URL}/api/v1/tasks`,
        {
          title: newTodoTitle,
          description: newTodoDescription,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to create todo");
      }

      const createdTodo = response.data.todo;
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setIsModalOpen(false);
      setNewTodoTitle("");
      setNewTodoDescription("");
    } catch (error: any) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/tasks/${id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete todo");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error: any) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStatusToggle = async (id: string) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;

      const response = await axios.put(
        `${BACKEND_URL}/api/v1/tasks/${id}`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update todo status");
      }

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === id ? { ...t, status: !t.status } : t))
      );
    } catch (error: any) {
      console.error("Error updating todo status:", error);
    }
  };
  return (
    <div className="flex flex-col items-start justify-start min-h-screen min-w-screen p-20 bg-gray-100 font-mono">
      <div className="mt-4 flex w-full  items-center justify-center gap-3">
        <Input
          placeholder="Search todo"
          className="w-[400px]"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
        <Button className="ml-2 bg-neutral-400 text-black cursor-pointer" onClick={() => setIsModalOpen(true)}>
          Create Todo
        </Button>

        <Button className="ml-2 bg-red-400 text-white cursor-pointer" onClick={() => {
          localStorage.removeItem("authorization");
          navigate("/signin");
        }}>
          Logout
        </Button>
      </div>

      <div className="mt-6 w-full flex flex-col items-center justify-center gap-3">
        {loading && <p><CircularProgress /></p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && filteredTodos.length === 0 && <p>No todos found.</p>}
        {!loading && !error && filteredTodos.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-3">
            {filteredTodos.map((todo) => (
              <div
                className="w-120 h-32 p-1 rounded-2xl bg-white"
                key={todo._id}
              >
                <div className="flex items-center justify-between w-full h-full p-5">
                  <div className="h-full flex flex-col justify-between ">
                    <h4 className={cn("text-lg font-semibold",todo.status == true && "line-through" )}>{todo.title}</h4>
                    <p className={cn("text-sm text-gray-500", todo.status == true && "line-through stroke-black")}>{todo.description}</p>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-3">
                    <Button
                      variant={todo.status ? "outline" : "destructive"}
                      className={cn("mt-2 text-black", todo.status ? "bg-black text-white" : "bg-neutral-400 text-black")}
                      onClick={() => {
                        handleStatusToggle(todo._id);
                      }}
                    >
                      {todo.status ? "Completed" : "Pending"}
                    </Button>
                    <Button
                      variant={"destructive"}
                      className="mt-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => {
                        handleDeleteTodo(todo._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-0"
              onClick={() => setIsModalOpen(false)}
            />
            <div
              className={`relative z-10 bg-white rounded-lg text-left overflow-hidden shadow-xl w-full ${sizeClasses["md"]}`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="p-6">
                <div className="flex flex-col gap-7">
                  <h1 className="text-2xl font-bold">Create todo</h1>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <LabelledInput
                      label="Title"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                    />
                    <LabelledInput
                      label="Description"
                      value={newTodoDescription}
                      onChange={(e) => setNewTodoDescription(e.target.value)}
                    />
                    <Button className="mt-4 bg-neutral-300 text-black" onClick={handleCreateTodo}>
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
