function Form({ children, type = "regular", className = "", ...props }) {
  const baseStyles = "overflow-hidden text-sm p-[2rem]";

  const variants = {
    regular: "w-[80rem]",
    modal:
      "w-[50rem] max-h-[85vh] overflow-y-auto bg-white border border-gray-100 rounded-md",
  };

  return (
    <form {...props} className={`${baseStyles} ${variants[type]} ${className}`}>
      {children}
    </form>
  );
}

export default Form;
