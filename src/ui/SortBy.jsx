import { useSearchParams } from "react-router-dom";
// import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <select
      value={sortBy}
      onChange={handleChange}
      className={`text-sm px-3 py-2 rounded font-medium shadow-sm bg-white transition-colors
         border border-gray-100
        `}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SortBy;
