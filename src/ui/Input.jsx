import { forwardRef } from "react";

const Input = forwardRef(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500 border border-gray-300 bg-white px-4 py-2 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 `}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
