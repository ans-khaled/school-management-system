import { FiSearch } from "react-icons/fi";

function InputSearch({
  placeholder,
  textStyle = "",
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Search ${placeholder}...`}
        disabled={disabled}
        className={`${disabled ? "cursor-not-allowed" : ""} rounded-md pl-6 py-2 border border-slate-200 ${textStyle || "text-sm"} text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-56 transition-all`}
      />
    </div>
  );
}

export default InputSearch;
