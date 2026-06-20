function StateCards({ cards }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-7">
      {cards.map((card) => {
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}
            >
              <span className={`${card.text} text-xl`}>{card.icon}</span>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StateCards;
