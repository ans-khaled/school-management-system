function ClassroomDetailsCard({ title, cardItemsList, warning }) {
  return (
    <div className="mb-4  gap-3">
      <h1 className="text-2xl font-semibold text-slate-800 tracking-tight my-4">
        <span className="inline-block mr-2 -mb-1 w-1.5 h-6 rounded-full bg-blue-500"></span>
        {title}
      </h1>

      {warning && (
        <div className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">
          ⚠️ {warning}
        </div>
      )}

      <div
        className={`grid gap-4 mb-6 ${
          cardItemsList.length === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {cardItemsList.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-lg`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p
                className={`text-sm font-semibold mt-0.5 ${
                  item.badge
                    ? item.value === "active"
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-slate-800"
                }`}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassroomDetailsCard;
