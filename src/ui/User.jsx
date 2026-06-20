import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import ConfirmLogout from "./ConfirmLogout";
import Modal from "./Modal";

function User() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="relative flex items-center justify-end bg-white">
      {/* User Button */}
      <Modal>
        <Modal.Open opens="logout">
          <button className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold uppercase">
              {user.name?.charAt(0) || "U"}
            </div>

            {/* Name + Role */}
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>

            <LogOut size={18} />
          </button>
        </Modal.Open>
        <Modal.Window name="logout">
          <ConfirmLogout />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default User;
