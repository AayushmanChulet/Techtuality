import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto text-lg font-bold">test app</div>
      </nav> 
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <Toaster />
      <footer className="bg-gray-200 text-center p-4">
        &copy; 2024 My Application
      </footer>
    </div>
  );
}