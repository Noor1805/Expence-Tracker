import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-black overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 h-full">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
