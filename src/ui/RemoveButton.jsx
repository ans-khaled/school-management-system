import { FiUserMinus } from "react-icons/fi";

function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      <FiUserMinus size={14} />
      Remove
    </button>
  );
}

export default RemoveButton;
