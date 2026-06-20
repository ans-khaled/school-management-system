import { NavLink } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { NAV_BY_ROLE, DEFAULT_NAV } from "../constants/navigation";

import ConfirmLogout from "./ConfirmLogout";
import Modal from "./Modal";
import { useAuth } from "../contexts/AuthContext";

function SideBar({ isSidebarOpen }) {
  const { logout, user } = useAuth();

  const nav = NAV_BY_ROLE[user?.role] ?? DEFAULT_NAV;

  const linkClass =
    "flex items-center gap-3 px-4 py-3 text-gray-500 text-sm font-medium rounded-md transition-all hover:bg-gray-100 hover:text-gray-800";

  const activeClass = "bg-gray-100 text-gray-800 [&_svg]:text-indigo-600";

  return (
    <aside
      aria-hidden={!isSidebarOpen}
      className="flex h-full flex-col p-4 bg-white text-white"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#A8761F]">
          <GraduationCap size={20} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-[Fraunces] text-base text-gray-500 leading-tight">
            EduManage Academy
          </p>
          <p className="text-xs leading-tight text-gray-500">
            {nav.portalLabel}
          </p>
        </div>
      </div>

      {/* Sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {nav.sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              {section.title}
            </h2>

            <ul className="flex flex-col gap-1">
              {section.items.map(({ label, icon: Icon, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `${linkClass} ${isActive ? activeClass : ""}`
                    }
                  >
                    <Icon className="text-lg text-gray-400 transition" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User  */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-500 px-3 py-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#A8761F] text-xs font-semibold">
            {user.name.split(" ")[0][0] + user.name.split(" ")[1][0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} User
            </p>
            <p className="truncate text-xs text-white/45">{user.name}</p>
          </div>
          <Modal>
            <Modal.Open opens="logout">
              <button
                type="button"
                className="text-white/45 hover:text-white cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut size={16} />
              </button>
            </Modal.Open>
            <Modal.Window name="logout">
              <ConfirmLogout />
            </Modal.Window>
          </Modal>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
