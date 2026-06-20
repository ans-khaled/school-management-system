import { FiAlertCircle, FiAward } from "react-icons/fi";

const LOW_ATTENDANCE = [
  { name: "Kareem Sayed", grade: "Grade 10B", rate: "61%", days: 12 },
  { name: "Sayed Hassan", grade: "Grade 11A", rate: "65%", days: 10 },
  { name: "Layla Mohamed", grade: "Grade 12A", rate: "68%", days: 9 },
];

const TOP_STUDENTS = [
  { name: "Mohamed Ali", gpa: 4.0, grade: "Grade 12A", attendance: "98%" },
  { name: "Ahmed Hassan", gpa: 3.9, grade: "Grade 11B", attendance: "96%" },
  { name: "Boola Ibrahim", gpa: 3.8, grade: "Grade 10A", attendance: "95%" },
  { name: "Sara Ahmed", gpa: 3.7, grade: "Grade 12B", attendance: "97%" },
  { name: "Nour Khaled", gpa: 3.6, grade: "Grade 11A", attendance: "94%" },
];

function StudentCharts() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* top students + low attendance */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <FiAward className="text-yellow-500" size={16} />
          <p className="font-semibold text-slate-800">Top Students (GPA)</p>
        </div>
        <div className="divide-y divide-slate-50">
          {TOP_STUDENTS.map((s, i) => (
            <div key={s.name} className="px-6 py-3.5 flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                    ${i === 0 ? "bg-yellow-50 text-yellow-500" : i === 1 ? "bg-slate-100 text-slate-500" : "bg-orange-50 text-orange-500"}`}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                <p className="text-slate-400 text-xs">{s.grade}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-500 text-sm">{s.gpa}</p>
                <p className="text-slate-400 text-xs">{s.attendance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* low attendance */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <FiAlertCircle className="text-red-400" size={16} />
          <p className="font-semibold text-slate-800">Low Attendance Alerts</p>
        </div>
        <div className="divide-y divide-slate-50">
          {LOW_ATTENDANCE.map((s) => (
            <div key={s.name} className="px-6 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                <p className="text-slate-400 text-xs">{s.grade}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-400">
                  {s.rate}
                </span>
                <p className="text-slate-400 text-xs mt-0.5">
                  {s.days} days absent
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentCharts;
