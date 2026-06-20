import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiFileText,
  FiAward,
  FiCalendar,
  FiClock,
  FiBook,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiMonitor,
  FiMapPin,
  FiTrendingUp,
  FiMessageSquare,
  FiChevronRight,
  FiX,
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

const TYPE_COLOR = {
  midterm: "bg-blue-50 text-blue-600",
  final: "bg-purple-50 text-purple-600",
  quiz: "bg-green-50 text-green-600",
};

function daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
}

// ── Detail Modal ───────────────────────────────────────────────────────────────
function ExamDetailModal({ exam, grade, color, onClose }) {
  const pct =
    grade && exam.max_score
      ? Math.round((grade.score / exam.max_score) * 100)
      : null;
  const gc = grade
    ? (GRADE_COLOR[grade.grade] ?? {
        bg: "bg-slate-50",
        text: "text-slate-500",
      })
    : null;
  const days = daysUntil(exam.scheduled_at);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <p className="font-semibold text-slate-800">Exam Details</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className={`${color} rounded-2xl p-6 text-white`}>
            <p className="text-white/70 text-xs mb-1">
              {exam.subject?.name ?? "—"}
            </p>
            <h2 className="text-xl font-bold mb-2">{exam.name}</h2>
            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 capitalize`}
            >
              {exam.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Date",
                value: new Date(exam.scheduled_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                icon: <FiCalendar />,
              },
              {
                label: "Duration",
                value: `${exam.duration_minutes} min`,
                icon: <FiClock />,
              },
              {
                label: "Mode",
                value: exam.is_online ? "Online" : "In-person",
                icon: exam.is_online ? <FiMonitor /> : <FiMapPin />,
              },
              {
                label: "Max Score",
                value: `${exam.max_score} pts`,
                icon: <FiAward />,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-slate-50 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-blue-500 flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-slate-800 font-semibold text-xs mt-0.5 truncate">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {exam.instructions && (
            <div>
              <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-1">
                Instructions
              </p>
              <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-3">
                {exam.instructions}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="font-semibold text-slate-800 mb-3 text-sm">Result</p>
            {grade ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-800">
                    {grade.score}/{exam.max_score}
                  </p>
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold ${gc.bg} ${gc.text}`}
                  >
                    {grade.grade ?? "—"}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 85 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {pct}% achieved · Graded by {grade.grader?.name ?? "—"}
                </p>
                {grade.remarks && (
                  <p className="text-slate-700 text-sm bg-blue-50 rounded-xl p-3 flex items-start gap-1.5">
                    <FiMessageSquare size={12} className="mt-0.5 shrink-0" />{" "}
                    {grade.remarks}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                {days > 0 ? (
                  <>
                    <FiClock className="text-yellow-400 text-2xl mb-2" />
                    <p className="text-slate-600 font-semibold text-sm">
                      Upcoming
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      In {days} day{days !== 1 ? "s" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <FiAlertCircle className="text-slate-300 text-2xl mb-2" />
                    <p className="text-slate-500 font-semibold text-sm">
                      No Grade Yet
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Awaiting grading
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentExamsGrades() {
  const [filter, setFilter] = useState("all"); // all | upcoming | graded | missed
  const [detailExam, setDetailExam] = useState(null);

  // 1) GET /student/exams
  const { data: examsData, isLoading: examsLoading } = useQuery({
    queryKey: ["student-exams"],
    queryFn: () =>
      fetch(`${BASE}/student/exams`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const exams = examsData?.data?.data ?? [];

  // 2) GET /student/grades
  const { data: gradesData, isLoading: gradesLoading } = useQuery({
    queryKey: ["student-grades"],
    queryFn: () =>
      fetch(`${BASE}/student/grades`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const grades = gradesData?.data?.data ?? [];

  // Join grades onto exams by exam.id
  const gradeByExamId = {};
  grades.forEach((g) => {
    if (g.exam?.id) gradeByExamId[g.exam.id] = g;
  });

  // Subject color map
  const subjectColorMap = {};
  let ci = 0;
  exams.forEach((e) => {
    const k = e.subject?.name ?? `s${e.id}`;
    if (!(k in subjectColorMap))
      subjectColorMap[k] = SUBJECT_COLORS[ci++ % SUBJECT_COLORS.length];
  });

  const now = new Date();
  const enriched = exams.map((e) => {
    const grade = gradeByExamId[e.id] ?? null;
    const days = daysUntil(e.scheduled_at);
    const status = grade ? "graded" : days > 0 ? "upcoming" : "missed";
    const color =
      subjectColorMap[e.subject?.name ?? `s${e.id}`] ?? SUBJECT_COLORS[0];
    const pct =
      grade && e.max_score
        ? Math.round((grade.score / e.max_score) * 100)
        : null;
    return { e, grade, days, status, color, pct };
  });

  const upcomingCount = enriched.filter((x) => x.status === "upcoming").length;
  const gradedCount = enriched.filter((x) => x.status === "graded").length;
  const missedCount = enriched.filter((x) => x.status === "missed").length;
  const avgScore =
    gradedCount > 0
      ? Math.round(
          enriched
            .filter((x) => x.pct !== null)
            .reduce((s, x) => s + x.pct, 0) / gradedCount,
        )
      : null;

  const filtered = enriched
    .filter((x) => (filter === "all" ? true : x.status === filter))
    .sort((a, b) => new Date(b.e.scheduled_at) - new Date(a.e.scheduled_at));

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isLoading = examsLoading || gradesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading exams & grades...</p>
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
            <h1 className="text-xl font-bold text-slate-800">Exams & Grades</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Exams",
                value: exams.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiFileText />,
              },
              {
                label: "Upcoming",
                value: upcomingCount,
                bg: "bg-orange-50",
                text: "text-orange-500",
                icon: <FiAlertCircle />,
              },
              {
                label: "Graded",
                value: gradedCount,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiAward />,
              },
              {
                label: "Average Score",
                value: avgScore !== null ? `${avgScore}%` : "—",
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiTrendingUp />,
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

          {/* FILTER TABS */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-5 w-fit">
            {[
              { key: "all", label: "All" },
              { key: "upcoming", label: "Upcoming" },
              { key: "graded", label: "Graded" },
              { key: "missed", label: "Missed" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === f.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* SINGLE TABLE — exams joined with grades */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">All Exams</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {filtered.length} shown
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                No exams match this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        "Exam",
                        "Subject",
                        "Type",
                        "Date",
                        "Duration",
                        "Score",
                        "Grade",
                        "Status",
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
                    {filtered.map(({ e, grade, days, status, color, pct }) => {
                      const gc = grade
                        ? (GRADE_COLOR[grade.grade] ?? {
                            bg: "bg-slate-50",
                            text: "text-slate-500",
                          })
                        : null;
                      return (
                        <tr
                          key={e.id}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => setDetailExam({ e, grade, color })}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-8 rounded-full ${color} shrink-0`}
                              />
                              <p className="font-semibold text-slate-800 truncate">
                                {e.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {e.subject?.name ?? "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${TYPE_COLOR[e.type] ?? "bg-slate-50 text-slate-500"}`}
                            >
                              {e.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(e.scheduled_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                            {status === "upcoming" && (
                              <p
                                className={`text-[10px] font-semibold mt-0.5 ${days <= 2 ? "text-red-500" : days <= 7 ? "text-yellow-600" : "text-slate-400"}`}
                              >
                                {days === 0 ? "Today" : `${days}d left`}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {e.duration_minutes} min
                          </td>
                          <td className="px-6 py-4">
                            {grade ? (
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${pct >= 85 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-slate-700">
                                  {grade.score}/{e.max_score}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {grade ? (
                              <span
                                className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-xs font-bold ${gc.bg} ${gc.text}`}
                              >
                                {grade.grade}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                              ${status === "graded" ? "bg-green-50 text-green-600" : status === "upcoming" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                              Details <FiChevronRight size={12} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {detailExam && (
        <ExamDetailModal
          exam={detailExam.e}
          grade={detailExam.grade}
          color={detailExam.color}
          onClose={() => setDetailExam(null)}
        />
      )}
    </div>
  );
}
