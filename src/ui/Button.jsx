function Button({
  onClick,
  variation = "primary",
  children,
  size = "medium",
  disabled = false,
  ...props
}) {
  // Text Size
  const small = "text-xs px-3 py-1 uppercase font-semibold text-center";

  const medium = "text-sm px-4 py-3 font-medium";

  const large = "text-base px-6 py-3 font-medium";

  // Button Variation
  const base = "border-0 rounded-sm shadow-sm cursor-pointer px-4 py-2";

  const primary = "bg-indigo-600 text-indigo-50 hover:bg-indigo-700";

  const secondary =
    "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50";

  const danger = "bg-red-700 text-red-100 hover:bg-red-800";

  const outline = "border border-gray-300 text-gray-700 hover:bg-gray-50";

  const ghost = "text-gray-600 hover:bg-gray-100";

  const ghostDanger = "text-red-500 hover:bg-red-50";

  const sizes = {
    small,
    medium,
    large,
  };

  const styles = {
    primary,
    secondary,
    danger,
    outline,
    ghost,
    "ghost-danger": ghostDanger,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variation]} ${sizes[size]}  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
