import { Menu, X } from "lucide-react";
import User from "../ui/User";

function AppHeader({ isSidebarOpen, onToggleSidebar }) {
  return (
    <div>
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-2 font-semibold text-gray-800">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <h1>School Management System</h1>
        </div>
        <div>
          <User />
        </div>
      </header>
    </div>
  );
}

export default AppHeader;
