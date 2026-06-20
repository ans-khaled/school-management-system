import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton({ title, to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to ? to : -1)}
      className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
    >
      <FiArrowLeft size={16} /> {title ? `Back to ${title}` : "Back"}
    </button>
  );
}

export default BackButton;
