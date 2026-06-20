import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiFileText,
  FiCalendar,
  FiClock,
  FiSearch,
  FiLoader,
  FiCheckCircle,
  FiAward,
  FiAlertCircle,
  FiBookOpen,
  FiMapPin,
  FiArrowLeft,
  FiBook,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "M70Z9OBzZDz9JryoZJSj2xyP02VvpqR9PQli4aN48a08a757";
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

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
function daysUntil(d) {
  const diff = new Date(d) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const TYPE_CONFIG = {
  midterm: { label: "Midterm", color: "text-blue-600", bg: "bg-blue-50" },
  final: { label: "Final", color: "text-purple-600", bg: "bg-purple-50" },
  quiz: { label: "Quiz", color: "text-green-600", bg: "bg-green-50" },
  homework: { label: "Homework", color: "text-orange-600", bg: "bg-orange-50" },
};
function typeCfg(t) {
  return (
    TYPE_CONFIG[t?.toLowerCase()] ?? {
      label: t ?? "Exam",
      color: "text-slate-600",
      bg: "bg-slate-100",
    }
  );
}

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

// ── Exam Detail Drawer ───────────────────────────────────────────────────────
function ExamDetail({ exam, grade, onBack }) {
  const cfg = typeCfg(exam.type);
  const upcoming = new Date(exam.scheduled_at) > new Date();
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

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
      >
        <FiArrowLeft size={16} /> Back to Exams
      </button>

      <div
        className={`rounded-2xl p-8 mb-6 text-white ${upcoming ? "bg-gradient-to-r from-blue-600 to-blue-400" : grade ? "bg-gradient-to-r from-green-600 to-green-400" : "bg-gradient-to-r from-slate-600 to-slate-400"}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
              {cfg.label}
            </span>
            <h1 className="text-3xl font-bold mt-3 mb-1">{exam.name}</h1>
            <p className="text-white/80 text-sm">
              {exam.subject?.name ?? "—"} · {exam.classroom?.name ?? "—"}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0">
            {exam.max_score}
          </div>
        </div>
      </div>

      {/* result card if graded */}
      {grade && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">
              Your Score
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {grade.score}/{exam.max_score}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">
              Percentage
            </p>
            <p className="text-2xl font-bold text-slate-800">{pct}%</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">
              Grade
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xl font-bold ${gc.bg} ${gc.text}`}
            >
              {grade.grade}
            </span>
          </div>
        </div>
      )}

      {/* exam details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <p className="font-semibold text-slate-800 mb-4">Exam Information</p>
        <div className="grid grid-cols-2 gap-5">
          {[
            {
              label: "Subject",
              value: exam.subject?.name ?? "—",
              icon: <FiBook />,
            },
            {
              label: "Classroom",
              value: exam.classroom?.name ?? "—",
              icon: <FiBookOpen />,
            },
            {
              label: "Date",
              value: fmtDate(exam.scheduled_at),
              icon: <FiCalendar />,
            },
            {
              label: "Time",
              value: fmtTime(exam.scheduled_at),
              icon: <FiClock />,
            },
            {
              label: "Duration",
              value: `${exam.duration_minutes} minutes`,
              icon: <FiClock />,
            },
            {
              label: "Max Score",
              value: `${exam.max_score} points`,
              icon: <FiAward />,
            },
            {
              label: "Format",
              value: exam.is_online ? "Online" : "In-Person",
              icon: <FiMapPin />,
            },
            {
              label: "Status",
              value: upcoming
                ? `In ${daysUntil(exam.scheduled_at)} day(s)`
                : grade
                  ? "Completed"
                  : "Past",
              icon: <FiAlertCircle />,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-slate-800 font-medium text-sm mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {exam.instructions && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-2">
              Instructions
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              {exam.instructions}
            </p>
          </div>
        )}
      </div>

      {grade?.remarks && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <FiCheckCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-blue-700 text-sm font-medium">Teacher remarks</p>
            <p className="text-blue-600 text-sm mt-0.5">{grade.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Exam Card ────────────────────────────────────────────────────────────────
function ExamCard({ exam, grade, onOpen }) {
  const cfg = typeCfg(exam.type);
  const upcoming = new Date(exam.scheduled_at) > new Date();
  const days = daysUntil(exam.scheduled_at);
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

  return (
    <button
      onClick={() => onOpen(exam)}
      className="w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </span>
          {grade ? (
            <span
              className={`text-sm font-bold px-2.5 py-1 rounded-full ${gc.bg} ${gc.text}`}
            >
              {grade.grade}
            </span>
          ) : upcoming ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600">
              {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days}d`}
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
              Missed
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-800 mb-1">{exam.name}</h3>
        <p className="text-slate-400 text-xs mb-4">
          {exam.subject?.name ?? "—"} · {exam.classroom?.name ?? "—"}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <FiCalendar size={11} /> {fmtDate(exam.scheduled_at)}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={11} /> {exam.duration_minutes}min
          </span>
        </div>

        {grade ? (
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-slate-800 font-bold text-sm">
                {grade.score}/{exam.max_score}
              </p>
              <p className="text-slate-400 text-xs">{pct}% scored</p>
            </div>
            <div
              className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-xs font-bold"
              style={{
                borderColor:
                  pct >= 85 ? "#22c55e" : pct >= 60 ? "#facc15" : "#f87171",
                color:
                  pct >= 85 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#dc2626",
              }}
            >
              {pct}%
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-blue-600 text-xs font-semibold">
              {exam.max_score} points total
            </p>
          </div>
        )}
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentExams() {
  const [tab, setTab] = useState("upcoming"); // upcoming | completed | all
  const [search, setSearch] = useState("");
  const [openExam, setOpenExam] = useState(null);

  const { data: examsData, isLoading: examsLoading } = useQuery({
    queryKey: ["student-exams-page"],
    queryFn: () => authedFetch(`${BASE}/student/exams?per_page=100`),
  });
  const exams = safeArr(examsData?.data);

  const { data: gradesData } = useQuery({
    queryKey: ["student-grades-for-exams"],
    queryFn: () => authedFetch(`${BASE}/student/grades?per_page=100`),
  });
  const grades = safeArr(gradesData?.data);

  const gradeByExamId = useMemo(() => {
    const map = new Map();
    grades.forEach((g) => {
      if (g.exam?.id) map.set(g.exam.id, g);
    });
    return map;
  }, [grades]);

  const now = new Date();
  const upcomingExams = exams
    .filter((e) => new Date(e.scheduled_at) > now)
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const completedExams = exams
    .filter((e) => new Date(e.scheduled_at) <= now)
    .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));

  const list =
    tab === "upcoming"
      ? upcomingExams
      : tab === "completed"
        ? completedExams
        : exams;
  const filtered = list.filter(
    (e) =>
      (e.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const gradedCount = completedExams.filter((e) =>
    gradeByExamId.has(e.id),
  ).length;
  const avgScore = grades.length
    ? Math.round(
        grades.reduce(
          (a, g) =>
            a +
            (g.exam?.max_score ? (g.score / g.exam.max_score) * 100 : g.score),
          0,
        ) / grades.length,
      )
    : null;

  const isLoading = examsLoading;

  if (openExam) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <ExamDetail
          exam={openExam}
          grade={gradeByExamId.get(openExam.id)}
          onBack={() => setOpenExam(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FiFileText className="text-blue-500" size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">My Exams</h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {exams.length} total exams
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Upcoming",
                value: upcomingExams.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiCalendar />,
              },
              {
                label: "Completed",
                value: completedExams.length,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiCheckCircle />,
              },
              {
                label: "Graded",
                value: gradedCount,
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiAward />,
              },
              {
                label: "Average Score",
                value: avgScore !== null ? `${avgScore}%` : "—",
                bg: "bg-orange-50",
                text: "text-orange-500",
                icon: <FiAward />,
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

          {/* tabs + search */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 w-fit">
              {[
                { key: "upcoming", label: "Upcoming" },
                { key: "completed", label: "Completed" },
                { key: "all", label: "All Exams" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${tab === t.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams..."
                className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-56 transition-all bg-white"
              />
            </div>
          </div>

          {/* exam grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <FiLoader className="text-2xl animate-spin" />
              <span className="text-sm">Loading exams...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
              <FiFileText className="text-slate-300 text-5xl mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                {exams.length === 0
                  ? "No exams found."
                  : `No ${tab !== "all" ? tab : ""} exams match your search.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  grade={gradeByExamId.get(exam.id)}
                  onOpen={setOpenExam}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
