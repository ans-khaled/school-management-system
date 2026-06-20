import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiFileText, FiAward, FiCalendar, FiClock, FiBook, FiPlus,
  FiLoader, FiCheckCircle, FiAlertCircle, FiMonitor,
  FiMapPin, FiTrendingUp, FiX, FiEdit2, FiTrash2, FiSearch,
  FiChevronRight, FiUsers, FiBarChart2, FiArrowLeft,
} from "react-icons/fi";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };

function safeArr(v) {
  return Array.isArray(v) ? v
    : Array.isArray(v?.data) ? v.data
    : Array.isArray(v?.data?.data) ? v.data.data
    : [];
}

async function authedFetch(url, options = {}) {
  const res  = await fetch(url, { ...options, headers: { ...HEADERS, ...(options.headers ?? {}) } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }
  return json;
}

const QUIZ_COLOR = "bg-green-50 text-green-600";

const GRADE_COLOR = {
  "A+": { bg: "bg-green-50",  text: "text-green-600" },
  "A":  { bg: "bg-green-50",  text: "text-green-500" },
  "A-": { bg: "bg-green-50",  text: "text-green-500" },
  "B+": { bg: "bg-blue-50",   text: "text-blue-600"  },
  "B":  { bg: "bg-blue-50",   text: "text-blue-500"  },
  "B-": { bg: "bg-blue-50",   text: "text-blue-500"  },
  "C+": { bg: "bg-yellow-50", text: "text-yellow-600"},
  "C":  { bg: "bg-yellow-50", text: "text-yellow-500"},
  "D":  { bg: "bg-orange-50", text: "text-orange-500"},
  "F":  { bg: "bg-red-50",    text: "text-red-500"   },
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// ── Exam Form (create / edit) ───────────────────────────────────────────────────
function ExamFormModal({ exam, classrooms, subjectOptions, onClose, onSuccess }) {
  const isEdit = !!exam;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEdit ? {
      name:              exam.name ?? "",
      subject_id:        exam.subject_id ?? exam.subject?.id ?? "",
      classroom_id:      exam.classroom_id ?? exam.classroom?.id ?? "",
      max_score:         exam.max_score ?? 100,
      scheduled_at:      toInputDate(exam.scheduled_at),
      duration_minutes:  exam.duration_minutes ?? 60,
      is_online:         exam.is_online ?? false,
      instructions:      exam.instructions ?? "",
    } : {
      max_score: 100, duration_minutes: 60, is_online: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const body = {
        ...formData,
        subject_id:       Number(formData.subject_id),
        classroom_id:      Number(formData.classroom_id),
        max_score:         Number(formData.max_score),
        duration_minutes:  Number(formData.duration_minutes),
        is_online:         !!formData.is_online,
        type:              "quiz",
      };
      if (isEdit) {
        return authedFetch(`${BASE}/teacher/exams/${exam.id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      return authedFetch(`${BASE}/teacher/exams`, { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Quiz updated" : "Quiz created");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="font-semibold text-slate-800">{isEdit ? "Edit Quiz" : "Create Quiz"}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Quiz Name</label>
            <input {...register("name", { required: true })} placeholder="Chapter 3 Vocabulary Quiz"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Max Score</label>
            <input type="number" {...register("max_score", { required: true, min: 1 })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Classroom</label>
              <select {...register("classroom_id", { required: true })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                <option value="">Select classroom</option>
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Subject</label>
              {subjectOptions.length > 0 ? (
                <select {...register("subject_id", { required: true })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                  <option value="">Select subject</option>
                  {subjectOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              ) : (
                <input type="number" {...register("subject_id", { required: true })} placeholder="Subject ID"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Scheduled Date</label>
              <input type="date" {...register("scheduled_at", { required: true })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Duration (min)</label>
              <input type="number" {...register("duration_minutes", { required: true, min: 1 })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register("is_online")} className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400" />
            <span className="text-sm text-slate-700">This exam is held online</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Instructions</label>
            <textarea {...register("instructions")} rows={3} placeholder="All questions must be answered. Show your work."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {mutation.isPending ? <FiLoader className="animate-spin" size={14} /> : isEdit ? <FiEdit2 size={14} /> : <FiPlus size={14} />}
              {mutation.isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ───────────────────────────────────────────────────────────────
function DeleteConfirmModal({ exam, onClose, onSuccess }) {
  const mutation = useMutation({
    mutationFn: () => authedFetch(`${BASE}/teacher/exams/${exam.id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Quiz deleted"); onSuccess(); onClose(); },
    onError:   (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><FiTrash2 size={18} /></div>
          <p className="font-semibold text-slate-800">Delete this quiz?</p>
        </div>
        <p className="text-slate-500 text-sm mb-5">
          "{exam.name}" and all associated grades will be permanently removed. This can't be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {mutation.isPending ? <FiLoader className="animate-spin" size={14} /> : <FiTrash2 size={14} />}
            {mutation.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Exam Detail Drawer (results + stats) ───────────────────────────────────────
function ExamDetailDrawer({ examId, onClose, onEdit, onDelete }) {
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ["teacher-exam-detail", examId],
    queryFn: () => authedFetch(`${BASE}/teacher/exams/${examId}`),
  });
  const exam = detailData?.data ?? null;

  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ["teacher-exam-results", examId],
    queryFn: () => authedFetch(`${BASE}/teacher/exams/${examId}/results`),
  });
  const resultsPayload = resultsData?.data ?? null;
  const results    = safeArr(resultsPayload?.results);
  const stats      = resultsPayload?.statistics ?? null;
  const totalStud  = resultsPayload?.total_students ?? null;
  const gradedCnt  = resultsPayload?.graded_count ?? null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-xl h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
            <FiArrowLeft size={16} /> Back
          </button>
          {exam && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(exam)} className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold hover:underline">
                <FiEdit2 size={12} /> Edit
              </button>
              <button onClick={() => onDelete(exam)} className="flex items-center gap-1.5 text-red-500 text-xs font-semibold hover:underline">
                <FiTrash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>

        {detailLoading || !exam ? (
          <div className="flex items-center justify-center py-24"><FiLoader className="text-blue-500 text-3xl animate-spin" /></div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-xs">{exam.subject?.name ?? "—"}</p>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20">Quiz</span>
              </div>
              <h2 className="text-xl font-bold mb-1">{exam.name}</h2>
              <p className="text-white/80 text-xs">{exam.classroom?.name ?? "—"}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Date",     value: fmtDate(exam.scheduled_at),       icon: <FiCalendar /> },
                { label: "Duration", value: `${exam.duration_minutes} min`,   icon: <FiClock /> },
                { label: "Mode",     value: exam.is_online ? "Online" : "In-person", icon: exam.is_online ? <FiMonitor /> : <FiMapPin /> },
                { label: "Max Score",value: `${exam.max_score} pts`,          icon: <FiAward /> },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">{c.icon}</div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">{c.label}</p>
                    <p className="text-slate-800 font-semibold text-sm mt-0.5 truncate">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {exam.instructions && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-1.5">Instructions</p>
                <p className="text-slate-700 text-sm">{exam.instructions}</p>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiBarChart2 className="text-purple-500" size={16} />
                <p className="font-semibold text-slate-800 text-sm">Results Overview</p>
              </div>
              {resultsLoading ? (
                <div className="flex justify-center py-6"><FiLoader className="text-blue-500 text-xl animate-spin" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Avg",   value: stats?.average_score != null ? stats.average_score : "—" },
                      { label: "High",  value: stats?.highest_score ?? "—" },
                      { label: "Low",   value: stats?.lowest_score ?? "—" },
                      { label: "Pass",  value: stats ? `${stats.pass_count}/${stats.pass_count + stats.fail_count}` : "—" },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-slate-800">{s.value}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {gradedCnt ?? results.length} of {totalStud ?? "—"} students graded
                  </p>
                </>
              )}

              {/* Per-student results */}
              {results.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No results recorded yet.</div>
              ) : (
                <div className="space-y-2">
                  {results.map((r, i) => {
                    const gc = GRADE_COLOR[r.grade] ?? { bg: "bg-slate-50", text: "text-slate-500" };
                    const pct = exam.max_score ? Math.round((r.score / exam.max_score) * 100) : null;
                    return (
                      <div key={r.student_id ?? i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                          {r.student_name?.[0] ?? "?"}
                        </div>
                        <p className="flex-1 min-w-0 font-medium text-slate-800 text-sm truncate">{r.student_name ?? "—"}</p>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-800">{r.score}/{exam.max_score}</p>
                          {pct !== null && <p className="text-[10px] text-slate-400">{pct}%</p>}
                        </div>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${gc.bg} ${gc.text}`}>{r.grade ?? "—"}</span>
                      </div>
                    );
                  })}
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
export default function TeacherExams() {
  const queryClient = useQueryClient();
  const [search,       setSearch]       = useState("");
  const [formModal,    setFormModal]    = useState(null);  // null | "create" | examObj (edit)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailId,     setDetailId]     = useState(null);

  // 1) Exams list
  const { data: examsData, isLoading: examsLoading, isError: examsError, error: examsErrorObj } = useQuery({
    queryKey: ["teacher-exams-list"],
    queryFn: () => authedFetch(`${BASE}/teacher/exams?type=quiz`),
  });
  const exams = safeArr(examsData?.data);

  // 2) Classrooms (for the create/edit dropdown)
  const { data: classroomsData } = useQuery({
    queryKey: ["teacher-classrooms-for-exams"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);

  // Subject options bootstrapped from existing exams (no dedicated /teacher/subjects endpoint documented)
  const subjectOptions = useMemo(() => {
    const map = {};
    exams.forEach(e => {
      const id = e.subject_id ?? e.subject?.id;
      const name = e.subject?.name;
      if (id && name && !map[id]) map[id] = { id, name };
    });
    return Object.values(map);
  }, [exams]);

  const refreshExams = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-exams-list"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-exam-detail"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-exam-results"] });
  };

  const now = new Date();
  const enriched = exams.map(e => ({
    e,
    days: Math.ceil((new Date(e.scheduled_at) - now) / (1000 * 60 * 60 * 24)),
    upcoming: new Date(e.scheduled_at) > now,
  }));

  const upcomingCount = enriched.filter(x => x.upcoming).length;
  const pastCount     = enriched.length - upcomingCount;

  const filtered = enriched
    .filter(({ e }) => (e.name ?? "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.e.scheduled_at) - new Date(a.e.scheduled_at));

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (examsLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (examsError) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center max-w-sm">
          <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-slate-800 font-semibold mb-1">Couldn't load quizzes</p>
          <p className="text-slate-500 text-sm">{examsErrorObj?.message}</p>
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
            <h1 className="text-xl font-bold text-slate-800">Quizzes</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <button onClick={() => setFormModal("create")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <FiPlus size={14} /> Create Quiz
          </button>
        </div>

        <div className="p-8">

          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Quizzes", value: exams.length,   bg: "bg-blue-50",   text: "text-blue-500",   icon: <FiFileText /> },
              { label: "Upcoming",     value: upcomingCount,   bg: "bg-orange-50", text: "text-orange-500", icon: <FiAlertCircle /> },
              { label: "Completed",    value: pastCount,       bg: "bg-green-50",  text: "text-green-500",  icon: <FiCheckCircle /> },
              { label: "Classrooms",   value: classrooms.length, bg: "bg-purple-50", text: "text-purple-500", icon: <FiUsers /> },
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
          </div>

          {/* SEARCH + FILTERS */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quizzes..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>

          {/* EXAMS TABLE */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">All Quizzes</p>
              <p className="text-slate-400 text-xs mt-0.5">{filtered.length} shown</p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                {exams.length === 0 ? "No quizzes created yet. Click \"Create Quiz\" to get started." : "No quizzes match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Quiz", "Classroom", "Subject", "Date", "Duration", "Max Score", ""].map(h => (
                        <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(({ e, days, upcoming }) => (
                      <tr key={e.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => setDetailId(e.id)}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 truncate">{e.name}</p>
                          {upcoming && (
                            <p className={`text-[10px] font-semibold mt-0.5 ${days <= 2 ? "text-red-500" : days <= 7 ? "text-yellow-600" : "text-slate-400"}`}>
                              {days === 0 ? "Today" : `In ${days}d`}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{e.classroom?.name ?? "—"}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{e.subject?.name ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${QUIZ_COLOR}`}>Quiz</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{fmtDate(e.scheduled_at)}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{e.duration_minutes} min</td>
                        <td className="px-6 py-4 text-slate-500">{e.max_score} pts</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 justify-end">
                            <button onClick={ev => { ev.stopPropagation(); setFormModal(e); }} className="text-slate-400 hover:text-blue-500 transition-colors">
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={ev => { ev.stopPropagation(); setDeleteTarget(e); }} className="text-slate-400 hover:text-red-500 transition-colors">
                              <FiTrash2 size={14} />
                            </button>
                            <FiChevronRight size={14} className="text-slate-300" />
                          </div>
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

      {(formModal === "create" || (formModal && typeof formModal === "object")) && (
        <ExamFormModal
          exam={typeof formModal === "object" ? formModal : null}
          classrooms={classrooms}
          subjectOptions={subjectOptions}
          onClose={() => setFormModal(null)}
          onSuccess={refreshExams}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          exam={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={refreshExams}
        />
      )}

      {detailId && (
        <ExamDetailDrawer
          examId={detailId}
          onClose={() => setDetailId(null)}
          onEdit={(exam) => { setDetailId(null); setFormModal(exam); }}
          onDelete={(exam) => { setDetailId(null); setDeleteTarget(exam); }}
        />
      )}
    </div>
  );
}
