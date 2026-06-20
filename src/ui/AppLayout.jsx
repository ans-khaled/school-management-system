import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import AppHeader from "./AppHeader";
import { useState } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`grid h-screen grid-rows-[auto_1fr] transition-[grid-template-columns] duration-300 ease-in-out ${
        isSidebarOpen ? "grid-cols-[20rem_1fr]" : "grid-cols-[0rem_1fr]"
      }`}
    >
      <div className="row-span-2 overflow-hidden">
        <SideBar isSidebarOpen={isSidebarOpen} />
      </div>

      <AppHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <main className="bg-gray-50 p-[4rem_4.8rem_6.4rem] overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
