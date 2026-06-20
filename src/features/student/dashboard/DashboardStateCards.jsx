import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

{
  /* <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Average Score",    value: stats ? `${stats.average_score}%` : "—",                                 bg: "bg-blue-50",   text: "text-blue-500",   icon: <FiTrendingUp /> },
              { label: "Attendance",       value: stats ? `${stats.attendance.present}/${stats.attendance.present + stats.attendance.absent + stats.attendance.late}` : "—", bg: "bg-green-50",  text: "text-green-500",  icon: <FiCheckCircle /> },
              { label: "Upcoming Exams",   value: stats?.upcoming_exams ?? "—",                                              bg: "bg-orange-50", text: "text-orange-500", icon: <FiFileText /> },
              { label: "Pending Tasks",    value: stats?.pending_assignments ?? "—",                                          bg: "bg-purple-50", text: "text-purple-500", icon: <FiAlertCircle /> },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                  <span className={`${c.text} text-xl`}>{c.icon}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">{c.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-0.5">{c.value}</p>
                </div>
              </div>
            ))}
          </div> */
}

function DashboardStateCards({ stats }) {
  return (
    <StateCards
      cards={[
        {
          label: "Average Score",
          value: stats ? `${stats.average_score}%` : "—",
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiTrendingUp />,
        },
        {
          label: "Attendance",
          value: stats
            ? `${stats.attendance?.present || 0}/${(stats.attendance?.present || 0) + (stats.attendance?.absent || 0) + (stats.attendance?.late || 0)}`
            : "—",
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiCheckCircle />,
        },
        {
          label: "Upcoming Exams",
          value: stats?.upcoming_exams ?? "—",
          bg: "bg-orange-50",
          text: "text-orange-500",
          icon: <FiFileText />,
        },
        {
          label: "Pending Tasks",
          value: stats?.pending_assignments ?? "—",
          bg: "bg-purple-50",
          text: "text-purple-500",
          icon: <FiAlertCircle />,
        },
      ]}
    />
  );
}

export default DashboardStateCards;
