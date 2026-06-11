import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-5 pt-[4.25rem] sm:pt-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}