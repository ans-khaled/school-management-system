function Header({ children }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{children}</h1>
      <p className="text-slate-400 text-sm mt-1">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}

export default Header;
