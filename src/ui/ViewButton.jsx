import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ViewButton({ category, id, backFrom, title }) {
  const navigate = useNavigate();

  return (
    <button
      className="px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100  rounded-lg transition-colors"
      onClick={() =>
        navigate(`/admin/${category}/${id}`, {
          state: { from: backFrom },
        })
      }
    >
      View {title}
      <FiArrowRight size={14} />
    </button>
  );
}

export default ViewButton;
