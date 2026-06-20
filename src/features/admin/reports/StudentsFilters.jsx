import { useState } from "react";
import { FiFilter } from "react-icons/fi";

const GRADES = [
  "All Classes",
  "Grade 10A",
  "Grade 10B",
  "Grade 11A",
  "Grade 11B",
  "Grade 12A",
  "Grade 12B",
];

function StudentsFilters() {
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-05-01");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [studentFilter, setStudentFilter] = useState("All Students");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-blue-500" size={15} />
        <p className="font-semibold text-slate-800 text-sm">Filters</p>
        <span className="text-slate-400 text-xs ml-1">
          — Filter by date and class
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Class
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Student
          </label>
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
          >
            <option value="All Student">All Student</option>
            <option value="Anas khaled">Anas khaled</option>
            <option value="Sayed Ragab">Sayed Ragab</option>
          </select>
        </div>
        <button className="mt-5 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors">
          Apply
        </button>
      </div>
    </div>
  );
}

export default StudentsFilters;
