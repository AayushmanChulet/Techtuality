import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <main className="h-full w-full">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}