import { forwardRef } from "react";

const SelectForm = forwardRef(({ options, className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`border border-gray-300 p-2 focus:border-blue-500 outline-none
        disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500
        ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

SelectForm.displayName = "SelectForm";

export default SelectForm;
