import { FiAlertCircle, FiAward } from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ReportStateCards from "./ReportStateCards";

const GROWTH_DATA = [
  { month: "Sep", students: 180 },
  { month: "Oct", students: 210 },
  { month: "Nov", students: 230 },
  { month: "Dec", students: 225 },
  { month: "Jan", students: 260 },
  { month: "Feb", students: 280 },
  { month: "Mar", students: 310 },
  { month: "Apr", students: 340 },
];

const ATTENDANCE_DATA = [
  { week: "W1", rate: 94 },
  { week: "W2", rate: 91 },
  { week: "W3", rate: 96 },
  { week: "W4", rate: 88 },
  { week: "W5", rate: 93 },
  { week: "W6", rate: 97 },
  { week: "W7", rate: 90 },
  { week: "W8", rate: 95 },
];

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

const TOP_TEACHERS = [
  {
    name: "Mr. Emad Fathy",
    subject: "Mathematics",
    rating: 4.9,
    attendance: "99%",
  },
  {
    name: "Miss. Hanaa Assfor",
    subject: "English",
    rating: 4.8,
    attendance: "98%",
  },
  {
    name: "Dr. Omar Farouk",
    subject: "Physics",
    rating: 4.7,
    attendance: "97%",
  },
];

function ReportsOverview() {
  return (
    <div>
      <ReportStateCards />

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* students growth */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="font-semibold text-slate-800 mb-1">Students Growth</p>
          <p className="text-slate-400 text-xs mb-4">
            Enrollment trend over months
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={GROWTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* attendance trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="font-semibold text-slate-800 mb-1">Attendance Trend</p>
          <p className="text-slate-400 text-xs mb-4">
            Weekly attendance percentage
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATTENDANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="rate" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* top students + low attendance */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* top students */}
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
                  <p className="font-semibold text-slate-800 text-sm">
                    {s.name}
                  </p>
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
            <p className="font-semibold text-slate-800">
              Low Attendance Alerts
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {LOW_ATTENDANCE.map((s) => (
              <div key={s.name} className="px-6 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">
                    {s.name}
                  </p>
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

        {/* top teachers */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <FiAward className="text-purple-500" size={16} />
            <p className="font-semibold text-slate-800">
              Top Teachers (Performance / Attendance)
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Teacher", "Subject", "Rating", "Attendance"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TOP_TEACHERS.map((t, i) => (
                <tr
                  key={t.name}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-xs">
                        {t.name.split(" ").find((w) => w.length > 2)?.[0] ??
                          "T"}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-500">
                      {t.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-500">
                    {t.rating} ⭐
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-500">
                      {t.attendance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsOverview;
