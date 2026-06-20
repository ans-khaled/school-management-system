function DetailsSectionsHeader({ children }) {
  return (
    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight my-4">
      <span className="inline-block mr-2 -mb-1 w-1.5 h-6 rounded-full bg-blue-500" />
      {children}
    </h1>
  );
}

export default DetailsSectionsHeader;
