import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        {/* mt-12 clears the fixed mobile top bar (h-12), mb-16 clears the fixed bottom nav */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 mt-12 mb-16 sm:mt-0 sm:mb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}