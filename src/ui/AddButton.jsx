import { FiPlus } from "react-icons/fi";

const buttonStyle =
  "flex items-center bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200";

function AddButton({ children, onClick, disabled = false, iconSize = 20 }) {
  return (
    <button
      onClick={onClick}
      className={`${buttonStyle} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <FiPlus size={iconSize} className="pr-1.5" />
      Add {children}
    </button>
  );
}

export default AddButton;
