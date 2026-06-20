import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiBook,
  FiBarChart2,
  FiBell,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiAward,
  FiTrendingUp,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiGrid,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "M70Z9OBzZDz9JryoZJSj2xyP02VvpqR9PQli4aN48a08a757";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const SUBJECT_COLORS = [
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

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function StudentDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  // ── 1. dashboard stats ─────────────────────────────────────────────────────
  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () =>
      fetch(`${BASE}/student/dashboard`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const dash = dashData?.data ?? null;
  const student = dash?.student ?? null;
  const classroom = dash?.classroom ?? null;
  const stats = dash?.stats ?? null;

  // ── 2. profile (full info) ─────────────────────────────────────────────────
  const { data: profileData } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () =>
      fetch(`${BASE}/student/profile`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const profile = profileData?.data ?? null;

  // ── 3. schedule (today) ────────────────────────────────────────────────────
  const { data: scheduleData } = useQuery({
    queryKey: ["student-schedule"],
    queryFn: () =>
      fetch(`${BASE}/student/schedule`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const todayKey =
    DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaySchedule = scheduleData?.data?.[todayKey] ?? [];

  // ── 4. exams ───────────────────────────────────────────────────────────────
  const { data: examsData } = useQuery({
    queryKey: ["student-exams"],
    queryFn: () =>
      fetch(`${BASE}/student/exams`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const exams = examsData?.data?.data ?? [];
  const upcomingExams = exams
    .filter((e) => new Date(e.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  // ── 5. subjects ────────────────────────────────────────────────────────────
  const { data: subjectsData } = useQuery({
    queryKey: ["student-subjects"],
    queryFn: () =>
      fetch(`${BASE}/student/subjects`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const subjects = subjectsData?.data ?? [];

  // ── 6. grades ──────────────────────────────────────────────────────────────
  const { data: gradesData } = useQuery({
    queryKey: ["student-grades"],
    queryFn: () =>
      fetch(`${BASE}/student/grades`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const grades = gradesData?.data?.data ?? [];

  // ── 7. assignments ─────────────────────────────────────────────────────────
  const { data: assignmentsData } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: () =>
      fetch(`${BASE}/student/assignments`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const assignments = assignmentsData?.data?.data ?? [];
  const pendingAssignments = assignments.filter((a) => !a.submitted);

  const isLoading = dashLoading;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Welcome back, {student?.name?.split(" ")[0] ?? "Student"} 👋
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              <FiBell size={18} />
            </button>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {student?.name?.[0]?.toUpperCase() ?? "S"}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* HERO: Student Info */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold">
                  {student?.name?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-0.5">
                    Student Profile
                  </p>
                  <h2 className="text-2xl font-bold mb-2">
                    {student?.name ?? "—"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      ID: {student?.student_id ?? "—"}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {profile?.user?.email ?? "—"}
                    </span>
                    {classroom && (
                      <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        📚 {classroom.name}
                      </span>
                    )}
                    {profile?.gender && (
                      <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize">
                        {profile.gender}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Avg Score",
                    value: stats ? `${stats.average_score}%` : "—",
                    icon: <FiAward size={16} />,
                  },
                  {
                    label: "Attendance",
                    value: stats ? `${stats.attendance.present}` : "—",
                    icon: <FiCheckCircle size={16} />,
                  },
                  {
                    label: "Subjects",
                    value: stats?.subjects_count ?? "—",
                    icon: <FiBook size={16} />,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/15 rounded-xl px-4 py-3 text-center"
                  >
                    <div className="flex justify-center mb-1 text-white/70">
                      {s.icon}
                    </div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-white/70 text-[11px]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {profile && (
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-4 gap-3">
                {[
                  {
                    label: "Date of Birth",
                    value: profile.date_of_birth
                      ? new Date(profile.date_of_birth).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "—",
                  },
                  { label: "Phone", value: profile.phone ?? "—" },
                  { label: "Address", value: profile.address ?? "—" },
                  {
                    label: "Enrolled",
                    value: profile.enrollment_date
                      ? new Date(profile.enrollment_date).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "—",
                  },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">
                      {d.label}
                    </p>
                    <p className="text-white text-xs font-medium truncate">
                      {d.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
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
                  ? `${stats.attendance.present}/${stats.attendance.present + stats.attendance.absent + stats.attendance.late}`
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

          <div className="grid grid-cols-3 gap-5 mb-5">
            {/* TODAY'S SCHEDULE */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    Today's Schedule
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 capitalize">
                    {todayKey}
                  </p>
                </div>
                <FiCalendar className="text-slate-400" size={16} />
              </div>
              {todaySchedule.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No classes scheduled for today.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {todaySchedule.map((s, i) => (
                    <div
                      key={s.id ?? i}
                      className="px-6 py-4 flex items-center gap-4"
                    >
                      <div className="text-center w-16 shrink-0">
                        <p className="text-blue-500 text-xs font-bold">
                          {s.start_time}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {s.end_time}
                        </p>
                      </div>
                      <div
                        className={`w-1 h-10 rounded-full ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]} shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">
                          {s.subject?.name ?? "—"}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {s.teacher?.user?.name ?? "—"} · Room{" "}
                          {s.room_number ?? "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* UPCOMING EXAMS */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="font-semibold text-slate-800">Upcoming Exams</p>
                <FiAlertCircle className="text-orange-400" size={15} />
              </div>
              {upcomingExams.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No upcoming exams.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {upcomingExams.slice(0, 4).map((e, i) => (
                    <div key={e.id ?? i} className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 text-sm">
                        {e.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {e.subject?.name ?? "—"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <FiCalendar size={10} />
                          {new Date(e.scheduled_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <FiClock size={10} /> {e.duration_minutes} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* SUBJECTS */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800">My Subjects</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {subjects.length} subjects{" "}
                  {classroom ? `in ${classroom.name}` : ""}
                </p>
              </div>
              {subjects.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No subjects found.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {subjects.map((s, i) => (
                    <div
                      key={s.id ?? i}
                      className="px-6 py-4 flex items-center gap-3"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                      >
                        {s.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">
                          {s.name}
                        </p>
                        <p className="text-slate-400 text-xs truncate">
                          {s.teachers?.[0]?.user?.name ?? "—"}
                        </p>
                      </div>
                      {s.credits && (
                        <span className="text-xs text-slate-400">
                          {s.credits} credits
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GRADES */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Recent Grades</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {grades.length} grade records
                  </p>
                </div>
                <button className="text-blue-500 text-xs font-semibold flex items-center gap-1 hover:underline">
                  View all <FiChevronRight size={12} />
                </button>
              </div>
              {grades.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No grades yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {grades.slice(0, 5).map((g, i) => {
                    const pct = g.exam?.max_score
                      ? Math.round((g.score / g.exam.max_score) * 100)
                      : g.score;
                    const gc = GRADE_COLOR[g.grade] ?? {
                      bg: "bg-slate-50",
                      text: "text-slate-500",
                    };
                    return (
                      <div
                        key={g.id ?? i}
                        className="px-6 py-3.5 flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">
                            {g.exam?.name ?? "—"}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {g.exam?.subject?.name ?? "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">
                              {g.score}/{g.exam?.max_score ?? "—"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct >= 85 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {pct}%
                              </span>
                            </div>
                          </div>
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${gc.bg} ${gc.text}`}
                          >
                            {g.grade ?? "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ASSIGNMENTS */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  Pending Assignments
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {pendingAssignments.length} not yet submitted
                </p>
              </div>
              <FiFileText className="text-slate-400" size={16} />
            </div>
            {assignments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No assignments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Title", "Subject", "Due Date", "Points", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {assignments.slice(0, 6).map((a, i) => (
                      <tr
                        key={a.id ?? i}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-medium text-slate-800">
                          {a.title}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500">
                          {a.subject?.name ?? "—"}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 text-xs">
                          {a.due_at
                            ? new Date(a.due_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500">
                          {a.points} pts
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                            ${a.submitted ? "bg-green-50 text-green-500" : "bg-yellow-50 text-yellow-500"}`}
                          >
                            {a.submitted ? "Submitted" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
