import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiGrid, FiUsers, FiBook, FiBarChart2, FiCreditCard,
  FiTruck, FiBell, FiLogOut, FiUser, FiFileText,
  FiLoader, FiDownload, FiAlertCircle, FiAward,
  FiTrendingUp, FiCalendar, FiFilter,
} from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "aRKPuwnLkS6ysMMLXxhhcJVJTElfvavfaEV9nqZ7aa00af4c";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };

const GRADES = ["All Classes", "Grade 10A", "Grade 10B", "Grade 11A", "Grade 11B", "Grade 12A", "Grade 12B"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GROWTH_DATA = [
  { month: "Sep", students: 180 }, { month: "Oct", students: 210 },
  { month: "Nov", students: 230 }, { month: "Dec", students: 225 },
  { month: "Jan", students: 260 }, { month: "Feb", students: 280 },
  { month: "Mar", students: 310 }, { month: "Apr", students: 340 },
];

const ATTENDANCE_DATA = [
  { week: "W1", rate: 94 }, { week: "W2", rate: 91 }, { week: "W3", rate: 96 },
  { week: "W4", rate: 88 }, { week: "W5", rate: 93 }, { week: "W6", rate: 97 },
  { week: "W7", rate: 90 }, { week: "W8", rate: 95 },
];

const REVENUE_DATA = [
  { month: "Sep", revenue: 45000 }, { month: "Oct", revenue: 52000 },
  { month: "Nov", revenue: 48000 }, { month: "Dec", revenue: 61000 },
  { month: "Jan", revenue: 55000 }, { month: "Feb", revenue: 67000 },
  { month: "Mar", revenue: 72000 }, { month: "Apr", revenue: 69000 },
];

const PIE_DATA = [
  { name: "Tuition",   value: 60, color: "#3b82f6" },
  { name: "Transport", value: 20, color: "#8b5cf6" },
  { name: "Activity",  value: 12, color: "#10b981" },
  { name: "Other",     value: 8,  color: "#f59e0b" },
];

const TOP_STUDENTS = [
  { name: "Mohamed Ali",   gpa: 4.0, grade: "Grade 12A", attendance: "98%" },
  { name: "Ahmed Hassan",  gpa: 3.9, grade: "Grade 11B", attendance: "96%" },
  { name: "Boola Ibrahim", gpa: 3.8, grade: "Grade 10A", attendance: "95%" },
  { name: "Sara Ahmed",    gpa: 3.7, grade: "Grade 12B", attendance: "97%" },
  { name: "Nour Khaled",   gpa: 3.6, grade: "Grade 11A", attendance: "94%" },
];

const TOP_TEACHERS = [
  { name: "Mr. Emad Fathy",   subject: "Mathematics",  rating: 4.9, attendance: "99%" },
  { name: "Miss. Hanaa Assfor", subject: "English",    rating: 4.8, attendance: "98%" },
  { name: "Dr. Omar Farouk",  subject: "Physics",      rating: 4.7, attendance: "97%" },
];

const LOW_ATTENDANCE = [
  { name: "Kareem Sayed",  grade: "Grade 10B", rate: "61%", days: 12 },
  { name: "Sayed Hassan",  grade: "Grade 11A", rate: "65%", days: 10 },
  { name: "Layla Mohamed", grade: "Grade 12A", rate: "68%", days: 9 },
];

export default function ReportsPage() {
  const [tab,       setTab]       = useState("student"); // student | finance
  const [dateFrom,  setDateFrom]  = useState("2026-01-01");
  const [dateTo,    setDateTo]    = useState("2026-05-01");
  const [classFilter, setClassFilter] = useState("All Classes");

  // real data
  const { data: studentsData, isLoading: loadingS } = useQuery({
    queryKey: ["students-reports"],
    queryFn: () => fetch(`${BASE}/students`, { headers: HEADERS }).then(r => r.json()),
  });
  const { data: teachersData, isLoading: loadingT } = useQuery({
    queryKey: ["teachers-reports"],
    queryFn: () => fetch(`${BASE}/teachers`, { headers: HEADERS }).then(r => r.json()),
  });

  const isLoading = loadingS || loadingT;

  const totalStudents = studentsData?.data?.total ?? studentsData?.data?.data?.length ?? 0;
  const totalTeachers = teachersData?.data?.total ?? teachersData?.data?.data?.length ?? 0;

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const rows = [
      ["Name", "Grade/Subject", "Value", "Attendance"],
      ...TOP_STUDENTS.map(s => [s.name, s.grade, s.gpa, s.attendance]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "report.csv"; a.click();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
            <p className="text-slate-400 text-sm mt-1">School Management System</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
              <FiDownload size={14} /> Export Excel
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
              <FiDownload size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-6 w-fit">
          <button onClick={() => setTab("student")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors
              ${tab === "student" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            Student Reports
          </button>
          <button onClick={() => setTab("finance")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors
              ${tab === "finance" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            Finance Reports
          </button>
        </div>

        {/* overview stat cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Students",   value: isLoading ? "…" : totalStudents, bg: "bg-blue-50",   text: "text-blue-500",   icon: <FiUsers /> },
            { label: "Total Teachers",   value: isLoading ? "…" : totalTeachers, bg: "bg-purple-50", text: "text-purple-500", icon: <FiUser /> },
            { label: "Total Subjects",   value: 8,                               bg: "bg-green-50",  text: "text-green-500",  icon: <FiBook /> },
            { label: "Total Revenue",    value: "250k EGP",                      bg: "bg-orange-50", text: "text-orange-500", icon: <FiCreditCard /> },
            { label: "Attendance Rate",  value: "92%",                           bg: "bg-teal-50",   text: "text-teal-500",   icon: <FiTrendingUp /> },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                <span className={`${c.text} text-lg`}>{c.icon}</span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{c.label}</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-blue-500" size={15} />
            <p className="font-semibold text-slate-800 text-sm">Filters</p>
            <span className="text-slate-400 text-xs ml-1">— Filter by date and class</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">From Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">To Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Class</label>
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <button className="mt-5 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* STUDENT REPORTS TAB */}
        {tab === "student" && (
          <>
            {/* charts row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* students growth */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="font-semibold text-slate-800 mb-1">Students Growth</p>
                <p className="text-slate-400 text-xs mb-4">Enrollment trend over months</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={GROWTH_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                    <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* attendance trend */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="font-semibold text-slate-800 mb-1">Attendance Trend</p>
                <p className="text-slate-400 text-xs mb-4">Weekly attendance percentage</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ATTENDANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
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
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${i === 0 ? "bg-yellow-50 text-yellow-500" : i === 1 ? "bg-slate-100 text-slate-500" : "bg-orange-50 text-orange-500"}`}>
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
                  {LOW_ATTENDANCE.map(s => (
                    <div key={s.name} className="px-6 py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {s.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                        <p className="text-slate-400 text-xs">{s.grade}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-400">{s.rate}</span>
                        <p className="text-slate-400 text-xs mt-0.5">{s.days} days absent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* top teachers */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <FiAward className="text-purple-500" size={16} />
                <p className="font-semibold text-slate-800">Top Teachers (Performance / Attendance)</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Teacher", "Subject", "Rating", "Attendance"].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {TOP_TEACHERS.map((t, i) => (
                    <tr key={t.name} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-xs">
                            {t.name.split(" ").find(w => w.length > 2)?.[0] ?? "T"}
                          </div>
                          <span className="font-semibold text-slate-800">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-500">{t.subject}</span></td>
                      <td className="px-6 py-4 font-bold text-blue-500">{t.rating} ⭐</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-500">{t.attendance}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* FINANCE REPORTS TAB */}
        {tab === "finance" && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* revenue chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="font-semibold text-slate-800 mb-1">Revenue Chart</p>
                <p className="text-slate-400 text-xs mb-4">Monthly revenue in EGP</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [`EGP ${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* revenue breakdown pie */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="font-semibold text-slate-800 mb-1">Revenue Breakdown</p>
                <p className="text-slate-400 text-xs mb-4">Percentage by fee type</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={11}>
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip formatter={v => [`${v}%`, "Share"]} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* finance summary table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800">Monthly Finance Summary</p>
                <p className="text-slate-400 text-xs mt-0.5">Collected vs target per month</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Month", "Collected (EGP)", "Target (EGP)", "Achievement", "Status"].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {REVENUE_DATA.map(r => {
                    const target = 70000;
                    const pct    = Math.round((r.revenue / target) * 100);
                    return (
                      <tr key={r.month} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{r.month}</td>
                        <td className="px-6 py-4 text-slate-600">EGP {r.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-400">EGP {target.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 w-10">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                            ${pct >= 90 ? "bg-green-50 text-green-500" : pct >= 70 ? "bg-yellow-50 text-yellow-500" : "bg-red-50 text-red-400"}`}>
                            {pct >= 90 ? "On Track" : pct >= 70 ? "Below Target" : "Critical"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
