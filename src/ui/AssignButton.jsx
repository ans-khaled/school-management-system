import { FiUserPlus } from "react-icons/fi";

function AssignButton({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      <FiUserPlus size={14} />
      Assign {title}
    </button>
  );
}

export default AssignButton;
