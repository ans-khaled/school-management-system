import { useSearchParams } from "react-router-dom";

function FilterSelect({ filterField, options, isLoading = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentValue = searchParams.get(filterField) || options.at(0).value;

  function handleChange(e) {
    searchParams.set(filterField, e.target.value);
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchParams(searchParams);
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      disabled={isLoading}
      className="text-sm px-3 py-2 rounded font-medium shadow-sm bg-white border 
        border-gray-100 text-gray-700 transition-colors cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-600"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default FilterSelect;
