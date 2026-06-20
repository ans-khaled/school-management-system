import { FiUsers } from "react-icons/fi";

function ParentsInfo({ parents }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <FiUsers className="text-green-500" size={16} />
        <p className="font-semibold text-slate-800">Parents / Guardians</p>
      </div>
      {parents.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No parent information linked yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {parents.map((p, i) => (
            <div key={p.id ?? i} className="px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center font-bold shrink-0">
                {p.user?.name?.[0] ?? p.name?.[0] ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm">
                  {p.user?.name ?? p.name ?? "—"}
                </p>
                <p className="text-slate-400 text-xs">
                  {p.user?.email ?? p.email ?? p.phone ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParentsInfo;
