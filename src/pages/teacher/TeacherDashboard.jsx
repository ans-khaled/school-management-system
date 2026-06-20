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
  FiUsers,
  FiGrid,
  FiChevronRight,
  FiLoader,
  FiMail,
  FiEdit3,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// Handles both response shapes seen across teacher endpoints:
//  - flat array:        { data: [...] }
//  - paginated/nested:  { data: { data: [...] } }
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
  const json = await res.json();
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

const TYPE_COLOR = {
  midterm: "bg-blue-50 text-blue-600",
  final: "bg-purple-50 text-purple-600",
  quiz: "bg-green-50 text-green-600",
  other: "bg-slate-50 text-slate-500",
};

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  // ── 1. profile (for greeting + identity) ───────────────────────────────────
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorObj,
  } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/teacher/profile`, { headers: HEADERS });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message ?? `Request failed (${res.status})`);
      }
      return json;
    },
  });
  // Real API shape: data = { id, name, email, role, ..., teacher: { teacher_id, phone, ... } }
  const user = profileData?.data ?? null;
  const profile = profileData?.data?.teacher ?? null;

  // ── 2. classrooms ───────────────────────────────────────────────────────────
  const { data: classroomsData } = useQuery({
    queryKey: ["teacher-classrooms"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);
  const totalStudents = classrooms.reduce(
    (s, c) => s + (c.students_count ?? 0),
    0,
  );

  // ── 3. submissions (ungraded = action item) ─────────────────────────────────
  const {
    data: submissionsData,
    isError: submissionsError,
    error: submissionsErrorObj,
  } = useQuery({
    queryKey: ["teacher-submissions-ungraded"],
    queryFn: () => authedFetch(`${BASE}/teacher/submissions?not_graded=true`),
  });
  const ungradedSubmissions = safeArr(submissionsData?.data);

  // ── 4. assignments ───────────────────────────────────────────────────────────
  const { data: assignmentsData } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () => authedFetch(`${BASE}/teacher/assignments`),
  });
  const assignments = safeArr(assignmentsData?.data);
  const activeAssignments = assignments.filter((a) => a.is_active);

  // ── 5. exams (upcoming) ──────────────────────────────────────────────────────
  const { data: examsData } = useQuery({
    queryKey: ["teacher-exams"],
    queryFn: () => authedFetch(`${BASE}/teacher/exams`),
  });
  const exams = safeArr(examsData?.data);
  const upcomingExams = exams
    .filter((e) => new Date(e.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  // ── 6. unread messages ────────────────────────────────────────────────────────
  const { data: unreadData } = useQuery({
    queryKey: ["teacher-unread-count"],
    queryFn: () => authedFetch(`${BASE}/teacher/messages/count/unread`),
  });
  const unreadCount = unreadData?.data?.unread_count ?? 0;

  // ── 7. recent messages ───────────────────────────────────────────────────────
  const { data: messagesData } = useQuery({
    queryKey: ["teacher-messages-recent"],
    queryFn: () => authedFetch(`${BASE}/teacher/messages`),
  });
  const recentMessages = safeArr(messagesData?.data);

  const isLoading = profileLoading;
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

  if (profileError) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center max-w-sm">
          <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-slate-800 font-semibold mb-1">
            Couldn't load your dashboard
          </p>
          <p className="text-slate-500 text-sm">
            {profileErrorObj?.message ?? "Something went wrong."}
          </p>
          <p className="text-slate-400 text-xs mt-3">
            Check that the token at the top of this file is valid and not
            expired.
          </p>
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
              Welcome back, {user?.name?.split(" ")[0] ?? "Teacher"} 👋
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "T"}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* HERO: Teacher Info */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-0.5">
                    Teacher Profile
                  </p>
                  <h2 className="text-2xl font-bold mb-2">
                    {user?.name ?? "—"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      ID: {profile?.teacher_id ?? "—"}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {user?.email ?? "—"}
                    </span>
                    {profile?.subject_specialization && (
                      <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        📚 {profile.subject_specialization}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Classrooms",
                    value: classrooms.length,
                    icon: <FiGrid size={16} />,
                  },
                  {
                    label: "Students",
                    value: totalStudents,
                    icon: <FiUsers size={16} />,
                  },
                  {
                    label: "To Grade",
                    value: ungradedSubmissions.length,
                    icon: <FiEdit3 size={16} />,
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
                    label: "Qualification",
                    value: profile.qualification ?? "—",
                  },
                  { label: "Phone", value: profile.phone ?? "—" },
                  {
                    label: "Hire Date",
                    value: profile.hire_date
                      ? new Date(profile.hire_date).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "—",
                  },
                  { label: "Address", value: profile.address ?? "—" },
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
                label: "Ungraded Submissions",
                value: ungradedSubmissions.length,
                bg: "bg-orange-50",
                text: "text-orange-500",
                icon: <FiAlertCircle />,
              },
              {
                label: "Unread Messages",
                value: unreadCount,
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiMail />,
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
            {/* MY CLASSROOMS */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">My Classrooms</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {classrooms.length} classes assigned to you
                  </p>
                </div>
                <FiGrid className="text-slate-400" size={16} />
              </div>
              {classrooms.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No classrooms assigned yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {classrooms.map((c, i) => (
                    <div
                      key={c.id ?? i}
                      className="px-6 py-4 flex items-center gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${CLASS_COLORS[i % CLASS_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                      >
                        {c.name?.[0] ?? "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">
                          {c.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          Grade {c.grade_level} · {c.academic_year}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800">
                          {c.students_count ?? 0}
                        </p>
                        <p className="text-[10px] text-slate-400">students</p>
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
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 text-sm">
                          {e.name}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[e.type] ?? TYPE_COLOR.other}`}
                        >
                          {e.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {e.classroom?.name ?? "—"}
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
            {/* GRADING QUEUE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Grading Queue</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {ungradedSubmissions.length} submissions waiting
                  </p>
                </div>
                <button className="text-blue-500 text-xs font-semibold flex items-center gap-1 hover:underline">
                  Grade now <FiChevronRight size={12} />
                </button>
              </div>
              {submissionsError ? (
                <div className="text-center py-10 px-6">
                  <p className="text-red-500 text-sm font-medium">
                    Couldn't load submissions
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    {submissionsErrorObj?.message}
                  </p>
                </div>
              ) : ungradedSubmissions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  All caught up — nothing to grade!
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {ungradedSubmissions.slice(0, 5).map((s, i) => (
                    <div
                      key={s.id ?? i}
                      className="px-6 py-3.5 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
                        {s.student?.user?.name?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {s.student?.user?.name ?? "—"}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {s.assignment?.title ?? "—"} ·{" "}
                          {s.submitted_at
                            ? new Date(s.submitted_at).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )
                            : "—"}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold bg-yellow-50 text-yellow-600 px-2.5 py-0.5 rounded-full shrink-0">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT MESSAGES */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    Recent Messages
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {recentMessages.length} total
                  </p>
                </div>
                <FiMail className="text-slate-400" size={16} />
              </div>
              {recentMessages.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No messages yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {recentMessages.slice(0, 5).map((m, i) => (
                    <div key={m.id ?? i} className="px-6 py-3.5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {m.subject}
                        </p>
                        {m.status === "unread" && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 truncate">
                        {m.sender?.id === user?.id
                          ? `To: ${m.receiver?.name}`
                          : `From: ${m.sender?.name}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE ASSIGNMENTS */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  Active Assignments
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {activeAssignments.length} currently open for submission
                </p>
              </div>
              <FiFileText className="text-slate-400" size={16} />
            </div>
            {assignments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No assignments created yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        "Title",
                        "Due Date",
                        "Points",
                        "Submissions",
                        "Status",
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
                    {assignments.slice(0, 6).map((a, i) => (
                      <tr
                        key={a.id ?? i}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-medium text-slate-800">
                          {a.title}
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
                        <td className="px-6 py-3.5 text-slate-500">
                          {a.submission_count ?? 0}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                            ${a.is_active ? "bg-green-50 text-green-500" : "bg-slate-100 text-slate-400"}`}
                          >
                            {a.is_active ? "Active" : "Closed"}
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
