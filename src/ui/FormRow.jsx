function FormRow({ children, error, label }) {
  return (
    <div
      className={`
        grid items-center grid-cols-[10rem_3fr_2fr] gap-4 py-3
        first:pt-0 last:pb-0
        not-last:border-b not-last:border-gray-100
        has-[button]:flex has-[button]:justify-end has-[button]:gap-3
      `}
    >
      {label && (
        <label htmlFor={children.props.id} className="font-medium">
          {label}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default FormRow;
