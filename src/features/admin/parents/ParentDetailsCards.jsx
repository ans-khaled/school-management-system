function ParentDetailsCards({ item }) {
  return (
    <div
      key={item.label}
      className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
    >
      <div
        className={`w-10 h-10 rounded-xl text-orange-500  flex items-center justify-center text-lg`}
      >
        {item.icon}
      </div>
      <div>
        <p className="text-slate-400  text-[11px] font-medium uppercase tracking-wide">
          {item.label}
        </p>
        <p className="text-slate-800 font-semibold text-sm mt-0.5">
          {item.value}
        </p>
      </div>
    </div>
  );
}

export default ParentDetailsCards;
