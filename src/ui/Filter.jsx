import { useSearchParams } from "react-router-dom";

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilterOption =
    searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchParams(searchParams);
  }

  return (
    <div className="border border-gray-100 bg-white shadow-sm rounded p-1 flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          disabled={option.value === currentFilterOption}
          className={`rounded px-3 py-1 text-sm font-medium transition-all duration-300 whitespace-nowrap
            ${
              option.value === currentFilterOption
                ? "bg-indigo-600 text-indigo-50 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-indigo-600 hover:text-indigo-50"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
