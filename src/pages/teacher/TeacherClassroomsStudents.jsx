import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiCheckCircle,
  FiLoader,
  FiSearch,
  FiArrowLeft,
  FiChevronRight,
  FiBook,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

function safeArr(v) {
  return Array.isArray(v)
    ? v
    : Array.isArray(v?.data)
      ? v.data
      : Array.isArray(v?.data?.data)
        ? v.data.data
        : [];
}

async function authedFetch(url) {
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }
  return json;
}

const CLASS_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

const GRADE_COLOR = {
  "A+": { bg: "bg-green-50", text: "text-green-600" },
  A: { bg: "bg-green-50", text: "text-green-500" },
  "A-": { bg: "bg-green-50", text: "text-green-500" },
  "B+": { bg: "bg-blue-50", text: "text-blue-600" },
  B: { bg: "bg-blue-50", text: "text-blue-500" },
  "B-": { bg: "bg-blue-50", text: "text-blue-500" },
  "C+": { bg: "bg-yellow-50", text: "text-yellow-600" },
  C: { bg: "bg-yellow-50", text: "text-yellow-500" },
  D: { bg: "bg-orange-50", text: "text-orange-500" },
  F: { bg: "bg-red-50", text: "text-red-500" },
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Student Detail Drawer ───────────────────────────────────────────────────────
function StudentDetailDrawer({ student, onClose }) {
  // The broken endpoint GET /teacher/students/{id} is skipped entirely.
  // Instead we use the student row we already have (from the working list)
  // plus two dedicated, working endpoints for grades and attendance.
  const s = student;

  const {
    data: gradesData,
    isLoading: gradesLoading,
    isError: gradesError,
    error: gradesErrorObj,
  } = useQuery({
    queryKey: ["teacher-student-grades", s?.id],
    queryFn: () => authedFetch(`${BASE}/teacher/grades/student/${s.id}`),
    enabled: !!s?.id,
  });
  const grades = safeArr(gradesData?.data);

  const {
    data: attData,
    isLoading: attLoading,
    isError: attError,
    error: attErrorObj,
  } = useQuery({
    queryKey: ["teacher-student-attendance-summary", s?.id],
    queryFn: () =>
      authedFetch(`${BASE}/teacher/attendance/student/${s.id}/summary`),
    enabled: !!s?.id,
  });
  const att = attData?.data ?? null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Hero — built directly from the row we already have, no extra request needed */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0">
                {s?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs">{s?.student_id ?? "—"}</p>
                <h2 className="text-xl font-bold truncate">
                  {s?.user?.name ?? "—"}
                </h2>
                <p className="text-white/80 text-xs truncate">
                  {s?.user?.email ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Personal info — also from the row we already have */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="font-semibold text-slate-800 text-sm mb-4">
              Personal Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Date of Birth",
                  value: s?.date_of_birth ? fmtDate(s.date_of_birth) : "—",
                  icon: <FiCalendar />,
                },
                {
                  label: "Gender",
                  value: s?.gender
                    ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1)
                    : "—",
                  icon: <FiUser />,
                },
                { label: "Phone", value: s?.phone ?? "—", icon: <FiPhone /> },
                {
                  label: "Address",
                  value: s?.address ?? "—",
                  icon: <FiMapPin />,
                },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                      {c.label}
                    </p>
                    <p className="text-slate-800 font-medium text-xs mt-0.5 truncate">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance — from GET /teacher/attendance/student/{id}/summary, bypasses the broken endpoint */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiCheckCircle className="text-green-500" size={16} />
              <p className="font-semibold text-slate-800 text-sm">Attendance</p>
            </div>
            {attLoading ? (
              <div className="flex justify-center py-6">
                <FiLoader className="text-blue-500 text-xl animate-spin" />
              </div>
            ) : attError ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                  {attErrorObj?.message}
                </p>
              </div>
            ) : att ? (
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 72 72"
                    className="-rotate-90"
                  >
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 30}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        30 *
                        (1 - (att.attendance_percentage ?? 0) / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">
                      {att.attendance_percentage ?? 0}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {att.attendance_stats?.present ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Present
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {att.total_classes ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Total Classes
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {att.attendance_stats?.absent ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Absent
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {att.attendance_stats?.late ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Late
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">
                No attendance data available.
              </p>
            )}
          </div>

          {/* Grades — from GET /teacher/grades/student/{id}, bypasses the broken relationship */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiAward className="text-purple-500" size={16} />
              <p className="font-semibold text-slate-800 text-sm">Grades</p>
            </div>
            {gradesLoading ? (
              <div className="flex justify-center py-6">
                <FiLoader className="text-blue-500 text-xl animate-spin" />
              </div>
            ) : gradesError ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                  {gradesErrorObj?.message}
                </p>
              </div>
            ) : grades.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">
                No grades recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {grades.map((g, i) => {
                  const gc = GRADE_COLOR[g.grade] ?? {
                    bg: "bg-slate-50",
                    text: "text-slate-500",
                  };
                  return (
                    <div
                      key={g.id ?? i}
                      className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm">
                          {g.exam_name ?? `Exam #${g.exam_id ?? "—"}`}
                        </p>
                        {g.remarks && (
                          <p className="text-slate-400 text-xs truncate mt-0.5">
                            {g.remarks}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 shrink-0">
                        {g.score ?? "—"}
                      </p>
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${gc.bg} ${gc.text}`}
                      >
                        {g.grade ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Classroom Detail Drawer ──────────────────────────────────────────────────────
function ClassroomDetailDrawer({ classroomId, onClose }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacher-classroom-detail", classroomId],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms/${classroomId}`),
  });
  const c = data?.data ?? null;
  const students = safeArr(c?.students);
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="text-blue-500 text-3xl animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-24 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
              <FiAlertCircle size={28} />
            </div>
            <p className="text-slate-800 font-bold text-base mb-2">
              This classroom couldn't load
            </p>
            <p className="text-slate-500 text-sm mb-4">
              The server returned an error fetching this record.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left w-full max-w-sm">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {error?.message}
              </p>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              This is a backend issue — send the message above to whoever
              maintains the API.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-xs">
                  Grade {c?.grade_level} · {c?.academic_year}
                </p>
                {c?.is_active && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
                    Active
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{c?.name}</h2>
              {c?.description && (
                <p className="text-white/80 text-xs">{c.description}</p>
              )}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <FiUsers size={16} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                    Enrolled
                  </p>
                  <p className="text-slate-800 font-bold text-sm mt-0.5">
                    {students.length}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <FiGrid size={16} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                    Capacity
                  </p>
                  <p className="text-slate-800 font-bold text-sm mt-0.5">
                    {c?.capacity ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Roster */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800 text-sm mb-3">
                  Class Roster
                </p>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  {students.length === 0
                    ? "No students enrolled yet."
                    : "No students match your search."}
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {filtered.map((s, i) => (
                    <button
                      key={s.id ?? i}
                      disabled
                      title="Open this student from the Students tab instead"
                      className="w-full px-5 py-3.5 flex items-center gap-3 opacity-60 cursor-not-allowed text-left"
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${CLASS_COLORS[i % CLASS_COLORS.length]} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                      >
                        {s.user?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {s.user?.name ?? "—"}
                        </p>
                        <p className="text-slate-400 text-xs truncate">
                          {s.student_id ?? "—"} · {s.user?.email ?? "—"}
                        </p>
                      </div>
                      <FiChevronRight
                        size={14}
                        className="text-slate-300 shrink-0"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherClassroomsStudents() {
  const [tab, setTab] = useState("classrooms"); // classrooms | students
  const [search, setSearch] = useState("");
  const [classroomDetailId, setClassroomDetailId] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null); // full student object, not just id

  // 1) Classrooms
  const {
    data: classroomsData,
    isLoading: classroomsLoading,
    isError: classroomsError,
    error: classroomsErrorObj,
  } = useQuery({
    queryKey: ["teacher-classrooms-page"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);

  // 2) Students (across all classrooms)
  const {
    data: studentsData,
    isLoading: studentsLoading,
    isError: studentsError,
    error: studentsErrorObj,
  } = useQuery({
    queryKey: ["teacher-students-page"],
    queryFn: () => authedFetch(`${BASE}/teacher/students`),
  });
  const students = safeArr(studentsData?.data);

  const totalStudents = classrooms.reduce(
    (s, c) => s + (c.students_count ?? 0),
    0,
  );

  const filteredClassrooms = classrooms.filter((c) =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const filteredStudents = students.filter(
    (s) =>
      (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.student_id ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isLoading = classroomsLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">
            Loading classrooms & students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        {/* top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Classrooms & Students
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "My Classrooms",
                value: classrooms.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiGrid />,
              },
              {
                label: "Total Students",
                value: totalStudents,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiUsers />,
              },
              {
                label: "Avg Class Size",
                value:
                  classrooms.length > 0
                    ? Math.round(totalStudents / classrooms.length)
                    : "—",
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiBarChart2 />,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                  <span className={`${c.text} text-xl`}>{c.icon}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-0.5">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TABS + SEARCH */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1">
              {[
                {
                  key: "classrooms",
                  label: "Classrooms",
                  icon: <FiGrid size={13} />,
                },
                {
                  key: "students",
                  label: "Students",
                  icon: <FiUsers size={13} />,
                },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setSearch("");
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  tab === "classrooms"
                    ? "Search classrooms..."
                    : "Search students..."
                }
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* CLASSROOMS TAB */}
          {tab === "classrooms" &&
            (classroomsError ? (
              <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
                <FiAlertCircle className="text-red-400 text-3xl mx-auto mb-3" />
                <p className="text-slate-700 font-semibold text-sm">
                  Couldn't load classrooms
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {classroomsErrorObj?.message}
                </p>
              </div>
            ) : filteredClassrooms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
                <FiGrid className="text-slate-300 text-4xl mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  {classrooms.length === 0
                    ? "No classrooms assigned yet."
                    : "No classrooms match your search."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredClassrooms.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setClassroomDetailId(c.id)}
                    className="text-left bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div
                      className={`${CLASS_COLORS[i % CLASS_COLORS.length]} px-5 pt-5 pb-8`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white/70 text-xs">
                            Grade {c.grade_level}
                          </p>
                          <h3 className="text-white font-bold text-lg mt-0.5">
                            {c.name}
                          </h3>
                        </div>
                        {c.is_active && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="-mt-4 mx-4 bg-white rounded-xl shadow-sm p-4 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <FiUsers size={11} /> {c.students_count ?? 0} /{" "}
                          {c.capacity ?? "—"} students
                        </span>
                        <span className="text-slate-400">
                          {c.academic_year}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-slate-400 text-xs mt-2 truncate">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <div className="px-4 pb-4">
                      <span className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold group-hover:bg-blue-100 transition-colors">
                        View Roster <FiChevronRight size={12} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}

          {/* STUDENTS TAB */}
          {tab === "students" &&
            (studentsError ? (
              <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
                <FiAlertCircle className="text-red-400 text-3xl mx-auto mb-3" />
                <p className="text-slate-700 font-semibold text-sm">
                  Couldn't load students
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {studentsErrorObj?.message}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <p className="font-semibold text-slate-800">All Students</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {filteredStudents.length} shown
                  </p>
                </div>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-14 text-slate-400 text-sm">
                    {students.length === 0
                      ? "No students found."
                      : "No students match your search."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {[
                            "Student",
                            "Student ID",
                            "Email",
                            "Phone",
                            "Gender",
                            "",
                          ].map((h) => (
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
                        {filteredStudents.map((s, i) => (
                          <tr
                            key={s.id ?? i}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                            onClick={() => setStudentDetail(s)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full ${CLASS_COLORS[i % CLASS_COLORS.length]} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                                >
                                  {s.user?.name?.[0]?.toUpperCase() ?? "?"}
                                </div>
                                <span className="font-medium text-slate-800">
                                  {s.user?.name ?? "—"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {s.student_id ?? "—"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {s.user?.email ?? "—"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {s.phone ?? "—"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs capitalize">
                              {s.gender ?? "—"}
                            </td>
                            <td className="px-6 py-4">
                              <FiChevronRight
                                size={14}
                                className="text-slate-300"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
        </div>
      </main>

      {classroomDetailId && (
        <ClassroomDetailDrawer
          classroomId={classroomDetailId}
          onClose={() => setClassroomDetailId(null)}
        />
      )}

      {studentDetail && (
        <StudentDetailDrawer
          student={studentDetail}
          onClose={() => setStudentDetail(null)}
        />
      )}
    </div>
  );
}
