import { today } from "../../../utils/helpers";

function DashboardHeader({ student }) {
  return (
    <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {student?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Welcome back, {student?.name?.split(" ")[0] ?? "Student"} 👋
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">{today}</p>
      </div>
    </div>
  );
}

export default DashboardHeader;
