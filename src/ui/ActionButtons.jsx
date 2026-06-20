import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ActionButtons({ type, category, id, onClick, children = "" }) {
  const navigate = useNavigate();

  if (type === "view") {
    return (
      <button
        className=" cursor-pointer p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition-colors"
        title="View"
        onClick={() => navigate(`/admin/${category}/${id}`)}
      >
        {children}
        <FiUser size={13} />
      </button>
    );
  }

  if (type === "update") {
    return (
      <button
        className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
        title="Edit"
        onClick={onClick}
      >
        <FiEdit2 size={13} />
      </button>
    );
  }

  if (type === "delete") {
    return (
      <button
        className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
        title="Delete"
        onClick={onClick}
      >
        <FiTrash2 size={13} />
      </button>
    );
  }

  return null;
}

export default ActionButtons;
